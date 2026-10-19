import React, { useState, useEffect } from 'react';
import { Material, Grade, SubjectId, AssessmentType } from './types';
import { api } from './services/api';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { BookmarksProvider } from './context/BookmarksContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { GradesPage } from './pages/GradesPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { MaterialsPage } from './pages/MaterialsPage';
import { MaterialDetailPage } from './pages/MaterialDetailPage';
import { PracticeTestPage } from './pages/PracticeTestPage';
import { SavedPage } from './pages/SavedPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

export function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [navParams, setNavParams] = useState<Record<string, any>>({});
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load materials from API/storage
  const refreshMaterials = async () => {
    try {
      const data = await api.getMaterials();
      setMaterials(data);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshMaterials();
  }, []);

  const handleNavigate = (page: string, params: Record<string, any> = {}) => {
    setCurrentPage(page);
    setNavParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewMaterial = (id: string) => {
    handleNavigate('detail', { materialId: id });
  };

  const handleStartPractice = (id: string) => {
    handleNavigate('practice', { materialId: id });
  };

  const handleSelectSubject = (subjectId: SubjectId) => {
    handleNavigate('materials', { subjectId });
  };

  // Find material for detail or practice view
  const currentMaterial = materials.find((m) => m.id === navParams.materialId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
            <span className="text-sm font-semibold">Yuklanmoqda... / Загрузка...</span>
          </div>
        ) : (
          <>
            {/* 1. HOME */}
            {currentPage === 'home' && (
              <HomePage
                materials={materials}
                onNavigate={handleNavigate}
                onViewMaterial={handleViewMaterial}
                onStartPractice={handleStartPractice}
              />
            )}

            {/* 2. GRADES 5-11 */}
            {currentPage === 'grades' && (
              <GradesPage
                initialGrade={navParams.grade as Grade}
                materials={materials}
                onViewMaterial={handleViewMaterial}
                onStartPractice={handleStartPractice}
                onNavigateToSubject={handleSelectSubject}
              />
            )}

            {/* 3. SUBJECTS */}
            {currentPage === 'subjects' && (
              <SubjectsPage
                materials={materials}
                onSelectSubject={handleSelectSubject}
              />
            )}

            {/* 4. BSB MATERIALS */}
            {currentPage === 'bsb' && (
              <MaterialsPage
                initialType="BSB"
                materials={materials}
                onViewMaterial={handleViewMaterial}
                onStartPractice={handleStartPractice}
              />
            )}

            {/* 5. CHSB MATERIALS */}
            {currentPage === 'chsb' && (
              <MaterialsPage
                initialType="CHSB"
                materials={materials}
                onViewMaterial={handleViewMaterial}
                onStartPractice={handleStartPractice}
              />
            )}

            {/* 6. GENERAL PRACTICE TESTS (shows all materials with practice tests) */}
            {currentPage === 'practice' && !currentMaterial && (
              <MaterialsPage
                materials={materials}
                onViewMaterial={handleViewMaterial}
                onStartPractice={handleStartPractice}
              />
            )}

            {/* PRACTICE TEST RUNNER */}
            {currentPage === 'practice' && currentMaterial && (
              <PracticeTestPage
                material={currentMaterial}
                onBack={() => handleNavigate('detail', { materialId: currentMaterial.id })}
                onFinish={() => handleNavigate('home')}
              />
            )}

            {/* GENERAL MATERIALS CATALOG (from search or filter jumps) */}
            {currentPage === 'materials' && (
              <MaterialsPage
                initialType={navParams.type as AssessmentType}
                initialGrade={navParams.grade as Grade}
                initialSubjectId={navParams.subjectId as SubjectId}
                initialSearch={navParams.search || ''}
                initialVerificationStatus={navParams.verificationStatus}
                materials={materials}
                onViewMaterial={handleViewMaterial}
                onStartPractice={handleStartPractice}
              />
            )}

            {/* 7. MATERIAL DETAIL */}
            {currentPage === 'detail' && (
              currentMaterial ? (
                <MaterialDetailPage
                  material={currentMaterial}
                  onBack={() => handleNavigate('materials')}
                  onStartPractice={handleStartPractice}
                />
              ) : (
                <div className="max-w-md mx-auto py-20 text-center">
                  <p className="text-sm font-semibold text-slate-500 mb-3">
                    Material topilmadi / Материал не найден
                  </p>
                  <button
                    onClick={() => handleNavigate('home')}
                    className="py-2 px-4 rounded-lg bg-blue-600 text-white text-xs font-bold"
                  >
                    Bosh sahifaga qaytish
                  </button>
                </div>
              )
            )}

            {/* 8. SAVED / BOOKMARKS */}
            {currentPage === 'saved' && (
              <SavedPage
                materials={materials}
                onViewMaterial={handleViewMaterial}
                onStartPractice={handleStartPractice}
                onBrowseMaterials={() => handleNavigate('materials')}
              />
            )}

            {/* 9. ABOUT */}
            {currentPage === 'about' && <AboutPage />}

            {/* 10. CONTACT & FEEDBACK */}
            {currentPage === 'contact' && <ContactPage />}

            {/* 11. ADMIN DASHBOARD */}
            {currentPage === 'admin' && (
              <AdminPage
                materials={materials}
                onMaterialsUpdated={refreshMaterials}
              />
            )}
          </>
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BookmarksProvider>
          <AppContent />
        </BookmarksProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
