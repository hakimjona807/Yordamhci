import { Material, MaterialReport, PracticeAttempt, VerificationStatus } from '../types';
import { INITIAL_MATERIALS } from '../data/initialMaterials';

const MATERIALS_STORAGE_KEY = 'bilimhub_materials_v1';
const REPORTS_STORAGE_KEY = 'bilimhub_reports_v1';
const ATTEMPTS_STORAGE_KEY = 'bilimhub_attempts_v1';
const ADMIN_TOKEN_KEY = 'bilimhub_admin_token';

// Helper to initialize materials with INITIAL_MATERIALS if empty
function loadStoredMaterials(): Material[] {
  try {
    const raw = localStorage.getItem(MATERIALS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  // save default
  try {
    localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(INITIAL_MATERIALS));
  } catch {
    // ignore
  }
  return INITIAL_MATERIALS;
}

function saveStoredMaterials(materials: Material[]): void {
  try {
    localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(materials));
  } catch {
    // ignore
  }
}

function loadStoredReports(): MaterialReport[] {
  try {
    const raw = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  // Default sample pending report for demonstration
  const sampleReports: MaterialReport[] = [
    {
      id: 'rep-sample-1',
      materialId: 'alg-7-bsb-2-2024',
      questionNumber: 3,
      issueType: 'wrong_answer',
      details: '3-savolda minimum qiymat 5 bo\'lishi kerak: x^2 - 6x + 14 = (x-3)^2 + 5. Iltimos kalitni tekshirib tasdiqlang.',
      submittedEmail: 'matematik_ustoz@gmail.com',
      createdAt: '2024-11-15T10:30:00Z',
      status: 'pending',
    },
  ];
  try {
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(sampleReports));
  } catch {
    // ignore
  }
  return sampleReports;
}

function saveStoredReports(reports: MaterialReport[]): void {
  try {
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
  } catch {
    // ignore
  }
}

export const api = {
  // Admin Authentication
  async adminLogin(password: string): Promise<{ token: string; role: 'admin' }> {
    // Check credentials: standard password 'admin2025' or 'bilim2025'
    if (password.trim() === 'admin2025' || password.trim() === 'bilim2025') {
      const token = 'bh_adm_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
      return { token, role: 'admin' };
    }
    throw new Error('Noto\'g\'ri parol yoki ruxsat etilmagan / Неверный пароль');
  },

  adminLogout(): void {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  },

  getAdminToken(): string | null {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  },

  isAdminAuthenticated(): boolean {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    return Boolean(token && token.startsWith('bh_adm_'));
  },

  // Materials
  async getMaterials(): Promise<Material[]> {
    return loadStoredMaterials();
  },

  async getMaterialById(id: string): Promise<Material | undefined> {
    const list = loadStoredMaterials();
    return list.find((m) => m.id === id);
  },

  async saveMaterial(material: Material, token: string): Promise<Material> {
    if (!token || !token.startsWith('bh_adm_')) {
      throw new Error('Ruxsat berilmagan: Administrator huquqi talab etiladi');
    }
    const current = loadStoredMaterials();
    const index = current.findIndex((m) => m.id === material.id);
    let updated: Material[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = { ...material, lastReviewedDate: new Date().toISOString().split('T')[0] };
    } else {
      updated = [
        {
          ...material,
          id: material.id || 'mat-' + Date.now(),
          lastReviewedDate: new Date().toISOString().split('T')[0],
        },
        ...current,
      ];
    }
    saveStoredMaterials(updated);
    return material;
  },

  async deleteMaterial(id: string, token: string): Promise<void> {
    if (!token || !token.startsWith('bh_adm_')) {
      throw new Error('Ruxsat berilmagan: Administrator huquqi talab etiladi');
    }
    const current = loadStoredMaterials();
    const filtered = current.filter((m) => m.id !== id);
    saveStoredMaterials(filtered);
  },

  async updateVerificationStatus(
    id: string,
    status: VerificationStatus,
    token: string
  ): Promise<Material> {
    if (!token || !token.startsWith('bh_adm_')) {
      throw new Error('Ruxsat berilmagan');
    }
    const current = loadStoredMaterials();
    const target = current.find((m) => m.id === id);
    if (!target) throw new Error('Material topilmadi');

    target.verificationStatus = status;
    target.lastReviewedDate = new Date().toISOString().split('T')[0];
    saveStoredMaterials(current);
    return target;
  },

  // Reports
  async submitReport(
    report: Omit<MaterialReport, 'id' | 'createdAt' | 'status'>
  ): Promise<MaterialReport> {
    const reports = loadStoredReports();
    const newReport: MaterialReport = {
      ...report,
      id: 'rep-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    const updated = [newReport, ...reports];
    saveStoredReports(updated);
    return newReport;
  },

  async getReports(token: string): Promise<MaterialReport[]> {
    if (!token || !token.startsWith('bh_adm_')) {
      throw new Error('Ruxsat yo\'q');
    }
    return loadStoredReports();
  },

  async updateReportStatus(
    reportId: string,
    status: 'resolved' | 'rejected',
    notes: string | undefined,
    token: string
  ): Promise<void> {
    if (!token || !token.startsWith('bh_adm_')) {
      throw new Error('Ruxsat yo\'q');
    }
    const reports = loadStoredReports();
    const target = reports.find((r) => r.id === reportId);
    if (target) {
      target.status = status;
      if (notes) target.adminNotes = notes;
      saveStoredReports(reports);
    }
  },

  // Practice Attempts
  async savePracticeAttempt(
    attempt: Omit<PracticeAttempt, 'id' | 'completedAt'>
  ): Promise<PracticeAttempt> {
    const newAttempt: PracticeAttempt = {
      ...attempt,
      id: 'att-' + Date.now(),
      completedAt: new Date().toISOString(),
    };
    try {
      const raw = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
      const list: PracticeAttempt[] = raw ? JSON.parse(raw) : [];
      list.unshift(newAttempt);
      localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
    } catch {
      // ignore
    }
    return newAttempt;
  },

  async getPracticeAttempts(): Promise<PracticeAttempt[]> {
    try {
      const raw = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  // Stats
  async getStats() {
    const materials = loadStoredMaterials();
    const reports = loadStoredReports();
    const attempts = await this.getPracticeAttempts();

    const verified = materials.filter((m) => m.verificationStatus === 'verified').length;
    const pendingReports = reports.filter((r) => r.status === 'pending').length;

    return {
      totalMaterials: materials.length,
      verifiedMaterials: verified,
      pendingReports,
      totalAttempts: attempts.length,
    };
  },
};
