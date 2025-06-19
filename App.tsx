
import React, { useState, useCallback } from 'react';
import { TargetAudience, InstagramContent, AnalysisReport, GENDER_OPTIONS } from './types';
import AudienceForm from './components/AudienceForm';
import ContentInputSection from './components/ContentInputSection';
import AnalysisDisplay from './components/AnalysisDisplay';
import LoadingSpinner from './components/common/LoadingSpinner';
import Alert from './components/common/Alert';
import { getAnalysis } from './services/geminiService';
import { SparklesIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [targetAudience, setTargetAudience] = useState<TargetAudience>({
    ageMin: '18',
    ageMax: '35',
    gender: GENDER_OPTIONS[0].value,
    location: '',
    interests: '',
  });
  const [instagramContent, setInstagramContent] = useState<InstagramContent>({
    link: '',
    caption: '',
  });
  const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAudienceChange = useCallback((field: keyof TargetAudience, value: string) => {
    setTargetAudience(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleContentChange = useCallback((field: keyof InstagramContent, value: string) => {
    setInstagramContent(prev => ({ ...prev, [field]: value }));
  }, []);

  const validateInputs = (): boolean => {
    if (!targetAudience.ageMin || !targetAudience.ageMax || parseInt(targetAudience.ageMin) > parseInt(targetAudience.ageMax)) {
      setError("Ups, rentang usianya belum pas nih. Yuk, dicek lagi biar hasilnya maksimal!");
      return false;
    }
    if (!targetAudience.location.trim()) {
      setError("Lokasi target audiensmu penting lho! Yuk, diisi dulu ya.");
      return false;
    }
    if (!targetAudience.interests.trim()) {
      setError("Apa sih yang disukai audiensmu? Ceritain minat mereka di sini ya!");
      return false;
    }
    if (!instagramContent.caption.trim() && !instagramContent.link.trim()) {
        setError("Caption atau link Instagram-nya jangan sampai kelewat ya. Keduanya bikin analisa makin top!");
        return false;
    }
    if (instagramContent.link.trim() && !instagramContent.link.startsWith("https://www.instagram.com/")) {
        setError("Hmm, format link Instagram-nya sepertinya perlu diperiksa lagi. Pastikan dimulai dengan `https://www.instagram.com/` ya!");
        return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    setAnalysisReport(null);
    try {
      const report = await getAnalysis(targetAudience, instagramContent);
      setAnalysisReport(report);
    } catch (err) {
      console.error("Error during analysis:", err);
      const errorMessage = (err instanceof Error) ? err.message : "Waduh, sepertinya ada sedikit kendala saat analisa. Tenang, coba lagi beberapa saat ya, semangat!";
      setError(`Aduh! ${errorMessage} Mungkin coba refresh halaman atau cek koneksi internetmu. Jangan patah semangat!`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen container mx-auto px-4 py-8 text-white">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 flex items-center justify-center">
          <SparklesIcon className="h-12 w-12 mr-3 text-yellow-300" />
          ARTICLE FITUR SMM
          <ChartBarIcon className="h-12 w-12 ml-3 text-yellow-300" />
        </h1>
        <p className="text-xl text-purple-200">Dibuat sebagai produk samping dari penelitian mengenai pengaruh Fitur SMM terhadap Keputusan Pembelian!</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl space-y-8">
          <AudienceForm 
            audience={targetAudience} 
            onChange={handleAudienceChange} 
          />
          <ContentInputSection 
            content={instagramContent} 
            onChange={handleContentChange} 
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-lg text-lg shadow-lg transform transition-all duration-150 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Sedang Meracik Analisa Terbaik...</span>
              </>
            ) : (
              "Yuk, Analisa Sekarang!"
            )}
          </button>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl min-h-[400px] flex flex-col justify-center">
          {isLoading && !analysisReport && (
            <div className="text-center">
              <LoadingSpinner />
              <p className="mt-4 text-lg text-purple-200">Sabar sebentar ya, AI kami lagi bekerja keras menganalisa kontenmu. Hasil terbaik butuh sedikit waktu!</p>
            </div>
          )}
          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
          {!isLoading && analysisReport && <AnalysisDisplay report={analysisReport} />}
          {!isLoading && !analysisReport && !error && (
            <div className="text-center text-purple-200">
              <SparklesIcon className="h-16 w-16 mx-auto mb-4 text-yellow-300 opacity-70" />
              <h2 className="text-2xl font-semibold mb-2">Wawasan Berharga Kontenmu Menanti di Sini!</h2>
              <p>Lengkapi detail di samping dan klik tombol analisa. Siap temukan insight keren untuk kontenmu? Pasti penasaran!</p>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center mt-16 py-8 border-t border-white/20">
        <p className="text-purple-200">&copy; {new Date().getFullYear()} Article oleh Muhammad Nur Irfan Wahyudi</p>
      </footer>
    </div>
  );
};

export default App;
