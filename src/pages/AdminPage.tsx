import React, { useState, useEffect } from 'react';
import { Material, MaterialReport, Grade, SubjectId, AssessmentType, Quarter, VerificationStatus, Question } from '../types';
import { ALL_GRADES, SUBJECTS, ACADEMIC_YEARS, getSubjectsForGrade } from '../data/curriculum';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import {
  Shield,
  Lock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Layers,
  FileText,
  Search,
  ExternalLink,
  Save,
  X,
  Sparkles,
} from 'lucide-react';

interface AdminPageProps {
  materials: Material[];
  onMaterialsUpdated: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  materials,
  onMaterialsUpdated,
}) => {
  const { language, t } = useLanguage();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(() => api.isAdminAuthenticated());
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalMaterials: materials.length,
    verifiedMaterials: 0,
    pendingReports: 0,
    totalAttempts: 0,
  });

  // Reports
  const [reports, setReports] = useState<MaterialReport[]>([]);
  const [activeTab, setActiveTab] = useState<'materials' | 'reports'>('materials');

  // Search & Filter within Admin
  const [adminSearch, setAdminSearch] = useState('');

  // Material Editor Modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Partial<Material> | null>(null);
  const [editorError, setEditorError] = useState('');
  const [editorSuccess, setEditorSuccess] = useState('');

  const loadData = async () => {
    const token = api.getAdminToken();
    if (!token) return;
    try {
      const st = await api.getStats();
      setStats(st);
      const rep = await api.getReports(token);
      setReports(rep);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, materials.length]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      // Real API login call to server endpoint
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('bilimhub_admin_token', data.token);
        setIsAuthenticated(true);
      } else {
        // Fallback to local admin check
        await api.adminLogin(password);
        setIsAuthenticated(true);
      }
    } catch (err: any) {
      setLoginError(t('loginError'));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    api.adminLogout();
    setIsAuthenticated(false);
    setPassword('');
  };

  // Open editor for new material
  const handleOpenCreate = () => {
    setEditingMaterial({
      id: 'mat-' + Date.now(),
      titleUz: '',
      titleRu: '',
      grade: 7,
      subjectId: 'algebra',
      academicYear: '2024-2025',
      quarter: 1,
      type: 'BSB',
      bsbNumber: 1,
      language: 'both',
      verificationStatus: 'community_review',
      sourceTitle: '',
      sourceUrl: '',
      publicationDate: new Date().toISOString().split('T')[0],
      descriptionUz: '',
      descriptionRu: '',
      curriculumContext: 'Davlat ta\'lim standarti',
      practiceDurationMinutes: 30,
      questions: [
        {
          id: 'q-new-1',
          questionNumber: 1,
          textUz: '',
          textRu: '',
          options: [
            { id: 'a', textUz: '', textRu: '' },
            { id: 'b', textUz: '', textRu: '' },
            { id: 'c', textUz: '', textRu: '' },
            { id: 'd', textUz: '', textRu: '' },
          ],
          correctOptionId: 'a',
          explanationUz: '',
          explanationRu: '',
          points: 2,
          isVerified: true,
        },
      ],
    });
    setEditorError('');
    setEditorSuccess('');
    setIsEditorOpen(true);
  };

  // Open editor for existing material
  const handleOpenEdit = (material: Material) => {
    setEditingMaterial(JSON.parse(JSON.stringify(material)));
    setEditorError('');
    setEditorSuccess('');
    setIsEditorOpen(true);
  };

  // Delete material
  const handleDeleteMaterial = async (id: string) => {
    if (!window.confirm(t('confirmDeleteMaterial'))) return;
    const token = api.getAdminToken();
    if (!token) return;
    try {
      await api.deleteMaterial(id, token);
      onMaterialsUpdated();
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error deleting material');
    }
  };

  // Quick toggle verification
  const handleQuickStatusChange = async (id: string, newStatus: VerificationStatus) => {
    const token = api.getAdminToken();
    if (!token) return;
    try {
      await api.updateVerificationStatus(id, newStatus, token);
      onMaterialsUpdated();
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  // Save Material in Editor
  const handleSaveEditor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial) return;
    setEditorError('');

    if (!editingMaterial.titleUz || !editingMaterial.titleRu) {
      setEditorError(
        language === 'uz'
          ? 'Materialning o\'zbekcha va ruscha sarlavhasini kiriting.'
          : 'Введите название на узбекском и русском языках.'
      );
      return;
    }

    const token = api.getAdminToken();
    if (!token) return;

    try {
      await api.saveMaterial(editingMaterial as Material, token);
      setEditorSuccess(t('materialSavedSuccess'));
      onMaterialsUpdated();
      loadData();
      setTimeout(() => {
        setIsEditorOpen(false);
      }, 700);
    } catch (err: any) {
      setEditorError(err.message || 'Error saving material');
    }
  };

  // Add Question inside Editor
  const handleAddQuestionToEditor = () => {
    if (!editingMaterial) return;
    const currentQuestions = editingMaterial.questions || [];
    const nextNum = currentQuestions.length + 1;
    const newQ: Question = {
      id: 'q-' + Date.now() + '-' + nextNum,
      questionNumber: nextNum,
      textUz: '',
      textRu: '',
      options: [
        { id: 'a', textUz: '', textRu: '' },
        { id: 'b', textUz: '', textRu: '' },
        { id: 'c', textUz: '', textRu: '' },
        { id: 'd', textUz: '', textRu: '' },
      ],
      correctOptionId: 'a',
      explanationUz: '',
      explanationRu: '',
      points: 2,
      isVerified: true,
    };
    setEditingMaterial({
      ...editingMaterial,
      questions: [...currentQuestions, newQ],
    });
  };

  // Resolve / Reject Report
  const handleReportAction = async (reportId: string, status: 'resolved' | 'rejected') => {
    const token = api.getAdminToken();
    if (!token) return;
    try {
      await api.updateReportStatus(reportId, status, 'Admin tomonidan ko\'rildi', token);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Filter materials for admin view
  const filteredMaterials = materials.filter((m) => {
    if (!adminSearch) return true;
    const q = adminSearch.toLowerCase();
    return (
      m.titleUz.toLowerCase().includes(q) ||
      m.titleRu.toLowerCase().includes(q) ||
      m.sourceTitle.toLowerCase().includes(q)
    );
  });

  // --- UNAUTHENTICATED LOGIN GATE ---
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('adminLoginTitle')}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('adminLoginDesc')}
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Admin paroli
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('adminPasswordPlaceholder')}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors disabled:opacity-60 cursor-pointer shadow-xs"
            >
              {isLoggingIn ? t('loading') : t('login')}
            </button>
          </form>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {language === 'uz' ? 'Eslatma:' : 'Примечание:'}
            </span>{' '}
            {language === 'uz'
              ? 'Standart admin paroli: `admin2025` yoki `bilim2025`'
              : 'Стандартный пароль администратора: `admin2025` или `bilim2025`'}
          </div>
        </div>
      </div>
    );
  }

  // --- AUTHENTICATED DASHBOARD ---
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
            <Shield className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {language === 'uz' ? 'Xavfsiz Boshqaruv Muhiti' : 'Защищенная среда управления'}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('adminTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('adminSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreate}
            className="py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t('createNewMaterial')}</span>
          </button>

          <button
            onClick={handleLogout}
            className="py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            {t('logout')}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('statsTotalMaterials')}</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {stats.totalMaterials}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('statsVerified')}</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {stats.verifiedMaterials}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('statsPendingReports')}</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {stats.pendingReports}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('statsPracticeAttempts')}</p>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {stats.totalAttempts}
          </p>
        </div>
      </div>

      {/* Tab Switcher: Materials vs Reports */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('materials')}
          className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'materials'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{language === 'uz' ? 'Materiallar boshqaruvi' : 'Управление материалами'}</span>
          <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
            {materials.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{t('reportsTitle')}</span>
          {stats.pendingReports > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px]">
              {stats.pendingReports}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: MATERIALS MANAGER */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder={language === 'uz' ? 'Materiallarni qidirish...' : 'Поиск материалов...'}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Sinf & Fan</th>
                    <th className="px-4 py-3">Turi</th>
                    <th className="px-4 py-3">Sarlavha</th>
                    <th className="px-4 py-3">Tekshiruv holati</th>
                    <th className="px-4 py-3">Savollar</th>
                    <th className="px-4 py-3 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredMaterials.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 whitespace-nowrap font-medium">
                        {m.grade}-sinf · {m.subjectId}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-bold text-blue-600 dark:text-blue-400">
                        {m.type} {m.quarter}-chorak
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate font-semibold text-slate-900 dark:text-white">
                        {language === 'uz' ? m.titleUz : m.titleRu}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <select
                          value={m.verificationStatus}
                          onChange={(e) =>
                            handleQuickStatusChange(m.id, e.target.value as VerificationStatus)
                          }
                          className="bg-transparent text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-slate-800 dark:text-slate-200"
                        >
                          <option value="verified">Verified</option>
                          <option value="official_unverified_key">Official (unverified)</option>
                          <option value="community_review">Community review</option>
                          <option value="practice_generated">Practice generated</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {m.questions.length} ta
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right space-x-1">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-md transition-colors"
                          title={t('editMaterial')}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMaterial(m.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-md transition-colors"
                          title={t('deleteMaterial')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER ERROR REPORTS */}
      {activeTab === 'reports' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {t('reportsTitle')}
          </h2>

          {reports.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">{t('noReports')}</p>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => {
                const targetMat = materials.find((m) => m.id === rep.materialId);

                return (
                  <div
                    key={rep.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                            rep.status === 'pending'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : rep.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {rep.status}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          Turi: {rep.issueType}
                        </span>
                        {rep.questionNumber && (
                          <span className="text-slate-500">
                            (Savol: #{rep.questionNumber})
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400">
                        {new Date(rep.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="font-medium text-slate-900 dark:text-white">
                      Material: {targetMat ? targetMat.titleUz : rep.materialId}
                    </p>

                    <p className="text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                      "{rep.details}"
                    </p>

                    {rep.submittedEmail && (
                      <p className="text-slate-400">
                        Yuboruvchi email: {rep.submittedEmail}
                      </p>
                    )}

                    {rep.status === 'pending' && (
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => handleReportAction(rep.id, 'resolved')}
                          className="py-1 px-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{t('resolveReport')}</span>
                        </button>
                        <button
                          onClick={() => handleReportAction(rep.id, 'rejected')}
                          className="py-1 px-3 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold"
                        >
                          {t('rejectReport')}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MATERIAL CREATOR / EDITOR MODAL */}
      {isEditorOpen && editingMaterial && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-xl relative my-8">
            <button
              onClick={() => setIsEditorOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              {editingMaterial.id && materials.some((m) => m.id === editingMaterial.id)
                ? t('editMaterial')
                : t('createNewMaterial')}
            </h2>

            {editorError && (
              <div className="p-3 mb-4 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 text-xs text-red-700 dark:text-red-300">
                {editorError}
              </div>
            )}
            {editorSuccess && (
              <div className="p-3 mb-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-xs text-emerald-700 dark:text-emerald-300">
                {editorSuccess}
              </div>
            )}

            <form onSubmit={handleSaveEditor} className="space-y-4 text-xs">
              {/* Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sarlavha (O'zbekcha) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMaterial.titleUz || ''}
                    onChange={(e) =>
                      setEditingMaterial({ ...editingMaterial, titleUz: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Заголовок (Русский) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMaterial.titleRu || ''}
                    onChange={(e) =>
                      setEditingMaterial({ ...editingMaterial, titleRu: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Grade, Subject, Type, Quarter, Academic Year */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sinf
                  </label>
                  <select
                    value={editingMaterial.grade || 7}
                    onChange={(e) =>
                      setEditingMaterial({
                        ...editingMaterial,
                        grade: Number(e.target.value) as Grade,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  >
                    {ALL_GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}-sinf
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fan
                  </label>
                  <select
                    value={editingMaterial.subjectId || 'math'}
                    onChange={(e) =>
                      setEditingMaterial({
                        ...editingMaterial,
                        subjectId: e.target.value as SubjectId,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nameUz}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Turi
                  </label>
                  <select
                    value={editingMaterial.type || 'BSB'}
                    onChange={(e) =>
                      setEditingMaterial({
                        ...editingMaterial,
                        type: e.target.value as AssessmentType,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  >
                    <option value="BSB">BSB</option>
                    <option value="CHSB">CHSB</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Chorak
                  </label>
                  <select
                    value={editingMaterial.quarter || 1}
                    onChange={(e) =>
                      setEditingMaterial({
                        ...editingMaterial,
                        quarter: Number(e.target.value) as Quarter,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  >
                    <option value={1}>1-chorak</option>
                    <option value={2}>2-chorak</option>
                    <option value={3}>3-chorak</option>
                    <option value={4}>4-chorak</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    O'quv yili
                  </label>
                  <select
                    value={editingMaterial.academicYear || '2024-2025'}
                    onChange={(e) =>
                      setEditingMaterial({
                        ...editingMaterial,
                        academicYear: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  >
                    {ACADEMIC_YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Verification Status & Source */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tekshiruv holati
                  </label>
                  <select
                    value={editingMaterial.verificationStatus || 'community_review'}
                    onChange={(e) =>
                      setEditingMaterial({
                        ...editingMaterial,
                        verificationStatus: e.target.value as VerificationStatus,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  >
                    <option value="verified">Verified (Tasdiqlangan)</option>
                    <option value="official_unverified_key">Official (Kalit tekshirilmagan)</option>
                    <option value="community_review">Community review</option>
                    <option value="practice_generated">Practice generated</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Asl manba nomi
                  </label>
                  <input
                    type="text"
                    value={editingMaterial.sourceTitle || ''}
                    onChange={(e) =>
                      setEditingMaterial({ ...editingMaterial, sourceTitle: e.target.value })
                    }
                    placeholder="Masalan: RTM metodik to'plami"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Asl manba havolasi (URL)
                  </label>
                  <input
                    type="url"
                    value={editingMaterial.sourceUrl || ''}
                    onChange={(e) =>
                      setEditingMaterial({ ...editingMaterial, sourceUrl: e.target.value })
                    }
                    placeholder="https://rtm.uz/..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Questions Section */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Savollar ({editingMaterial.questions?.length || 0})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddQuestionToEditor}
                    className="py-1 px-3 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Savol qo'shish</span>
                  </button>
                </div>

                <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                  {editingMaterial.questions?.map((q, qIndex) => (
                    <div
                      key={q.id || qIndex}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          #{qIndex + 1}-savol
                        </span>
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] font-medium text-slate-500">
                            To'g'ri variant:
                          </label>
                          <select
                            value={q.correctOptionId || 'a'}
                            onChange={(e) => {
                              const updatedQ = [...(editingMaterial.questions || [])];
                              updatedQ[qIndex].correctOptionId = e.target.value;
                              setEditingMaterial({ ...editingMaterial, questions: updatedQ });
                            }}
                            className="bg-white dark:bg-slate-900 border rounded px-1.5 py-0.5"
                          >
                            <option value="a">A</option>
                            <option value="b">B</option>
                            <option value="c">C</option>
                            <option value="d">D</option>
                          </select>
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder="Savol matni (O'zbekcha)"
                        value={q.textUz}
                        onChange={(e) => {
                          const updatedQ = [...(editingMaterial.questions || [])];
                          updatedQ[qIndex].textUz = e.target.value;
                          setEditingMaterial({ ...editingMaterial, questions: updatedQ });
                        }}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded p-1.5"
                      />

                      <input
                        type="text"
                        placeholder="Текст вопроса (Русский)"
                        value={q.textRu}
                        onChange={(e) => {
                          const updatedQ = [...(editingMaterial.questions || [])];
                          updatedQ[qIndex].textRu = e.target.value;
                          setEditingMaterial({ ...editingMaterial, questions: updatedQ });
                        }}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded p-1.5"
                      />

                      <textarea
                        rows={2}
                        placeholder="Bosqichma-bosqich yechim va izoh"
                        value={q.explanationUz || ''}
                        onChange={(e) => {
                          const updatedQ = [...(editingMaterial.questions || [])];
                          updatedQ[qIndex].explanationUz = e.target.value;
                          setEditingMaterial({ ...editingMaterial, questions: updatedQ });
                        }}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded p-1.5"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="py-2 px-4 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Saqlash</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
