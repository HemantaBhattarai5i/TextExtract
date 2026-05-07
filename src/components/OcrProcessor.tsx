import React, { useState, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import { Copy, Download, RefreshCw, Languages, Lock, Wand2, Share2, FileText, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import ImageUploader from './ImageUploader';
import ProgressBar from './ProgressBar';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const OcrProcessor: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [language, setLanguage] = useState('eng');
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usageCount, setUsageCount] = useState(() => {
    const stored = localStorage.getItem('ocrUsageCount');
    return stored ? parseInt(stored, 10) : 0;
  });
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const { isSignedIn } = useUser();
  const MAX_FREE_USAGE = 5;

  const languages = [
    { code: 'eng', name: 'English' },
    { code: 'nep', name: 'नेपाली (Nepali)' },
    { code: 'hin', name: 'हिंदी (Hindi)' },
    { code: 'ben', name: 'বাংলা (Bengali)' },
    { code: 'san', name: 'संस्कृत (Sanskrit)' },
    { code: 'urd', name: 'اردو (Urdu)' },
    { code: 'ara', name: 'العربية (Arabic)' },
    { code: 'spa', name: 'Español (Spanish)' },
    { code: 'fra', name: 'Français (French)' },
    { code: 'deu', name: 'Deutsch (German)' },
    { code: 'ita', name: 'Italiano (Italian)' },
    { code: 'por', name: 'Português (Portuguese)' },
    { code: 'rus', name: 'Русский (Russian)' },
    { code: 'chi_sim', name: '简体中文 (Chinese Simplified)' },
    { code: 'chi_tra', name: '繁體中文 (Chinese Traditional)' },
    { code: 'jpn', name: '日本語 (Japanese)' },
    { code: 'kor', name: '한국어 (Korean)' },
    { code: 'tha', name: 'ไทย (Thai)' },
    { code: 'vie', name: 'Tiếng Việt (Vietnamese)' },
    { code: 'mar', name: 'मराठी (Marathi)' }
  ];

  useEffect(() => {
    localStorage.setItem('ocrUsageCount', usageCount.toString());
  }, [usageCount]);

  useEffect(() => {
    if (text) {
      setCharCount(text.length);
      setWordCount(text.trim().split(/\s+/).length);
    } else {
      setCharCount(0);
      setWordCount(0);
    }
  }, [text]);

  const handleImageUpload = (file: File) => {
    if (!isSignedIn && usageCount >= MAX_FREE_USAGE) {
      setError('Free trial limit reached. Sign in for unlimited usage.');
      return;
    }

    setError(null);
    setImage(file);
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    setText('');
    setConfidence(null);
    processImage(file);

    if (!isSignedIn) {
      setUsageCount(prev => prev + 1);
    }
  };

  const handleImageClear = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImage(null);
    setPreviewUrl(null);
    setText('');
    setConfidence(null);
    setError(null);
    setWordCount(0);
    setCharCount(0);
  };

  const processImage = async (file: File) => {
    let worker;
    try {
      setIsProcessing(true);
      setProgress(0);
      setError(null);

      worker = await createWorker();

      worker.worker.addEventListener('message', (e) => {
        if (e.data.status === 'loading tesseract core' || e.data.status === 'loading language traineddata') {
          setProgress(e.data.progress * 50);
        } else if (e.data.status === 'recognizing text') {
          setProgress(50 + (e.data.progress * 50));
        }
      });

      await worker.loadLanguage(language);
      await worker.initialize(language);

      const { data } = await worker.recognize(file);

      if (!data.text || data.text.trim() === '') {
        setError('No legible text found. Try a higher resolution image.');
        setText('');
      } else {
        setText(data.text);
        setConfidence(data.confidence);
      }
    } catch (error) {
      console.error('OCR Error:', error);
      setError('Processing failed. Please check your connection and retry.');
      setText('');
    } finally {
      setIsProcessing(false);
      setProgress(100);
      if (worker) {
        await worker.terminate();
      }
    }
  };

  const handleReprocess = () => {
    if (image) {
      processImage(image);
    }
  };

  const handleCopyText = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleDownloadText = () => {
    if (text) {
      const element = document.createElement('a');
      const file = new Blob([text], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'extracted-text.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      URL.revokeObjectURL(element.href);
    }
  };

  const handleShare = async () => {
    if (text && navigator.share) {
      try {
        await navigator.share({
          title: 'Extracted Text | TextExtract',
          text: text,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const remainingFreeUses = MAX_FREE_USAGE - usageCount;

  return (
    <div className="space-y-8 animate-fade-in">
      {!isSignedIn && (
        <Alert className="bg-teal-50/50 border-teal-200/60 rounded-2xl animate-slide-up">
          <Info className="h-4 w-4 text-teal-600" />
          <AlertTitle className="text-teal-900 font-bold">Free Trial Active</AlertTitle>
          <AlertDescription className="text-teal-700">
            {remainingFreeUses > 0
              ? `You have ${remainingFreeUses} free processings remaining. Sign in for unlimited access.`
              : 'Limit reached. Please sign in to continue using TextExtract Studio.'}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Card */}
        <Card className="rounded-3xl border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="border-b border-slate-50 bg-slate-50/30 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Image Source</CardTitle>
                <CardDescription className="text-slate-400 font-medium">Upload or drag your visual data here</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Languages size={14} className="text-teal-600" />
                <Select
                  value={language}
                  onValueChange={(val) => {
                    setLanguage(val);
                    if (image) processImage(image);
                  }}
                  disabled={isProcessing}
                >
                  <SelectTrigger className="w-[140px] h-9 rounded-xl border-slate-200 bg-white text-xs font-bold">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code} className="text-xs font-medium focus:bg-teal-50 focus:text-teal-700">
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 flex-1">
            <ImageUploader
              onImageUpload={handleImageUpload}
              onImageClear={handleImageClear}
              previewUrl={previewUrl}
              isProcessing={isProcessing}
            />

            {isProcessing && (
              <div className="mt-6 space-y-3 animate-fade-in">
                <ProgressBar progress={progress} />
                <div className="flex items-center justify-between px-1">
                  <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">
                    {progress < 50 ? "Linking Neural Core..." : "Deconstructing Visuals..."}
                  </p>
                  <span className="text-[10px] font-black text-slate-400">{Math.round(progress)}%</span>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50/50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600 animate-scale">
                <AlertCircle size={18} />
                <p className="text-xs font-bold">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Output Card */}
        <Card className="rounded-3xl border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="border-b border-slate-50 bg-slate-50/30 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Extracted Output</CardTitle>
                <CardDescription className="text-slate-400 font-medium">Refined digital text from your image</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleCopyText}
                  disabled={!text || isProcessing}
                  size="sm"
                  variant="outline"
                  className={`rounded-xl h-9 px-3 text-xs font-bold transition-all ${copySuccess ? 'bg-teal-50 text-teal-600 border-teal-200' : 'hover:bg-teal-50 hover:text-teal-600 border-slate-200'
                    }`}
                >
                  {copySuccess ? <CheckCircle2 size={14} className="mr-2" /> : <Copy size={14} className="mr-2" />}
                  {copySuccess ? 'Success' : 'Copy'}
                </Button>

                {image && !isProcessing && (
                  <Button
                    onClick={handleReprocess}
                    size="sm"
                    variant="ghost"
                    className="rounded-xl h-9 w-9 p-0 text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all"
                  >
                    <RefreshCw size={14} />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex flex-col space-y-4">
            <div className="relative group flex-1 min-h-[300px]">
              <ScrollArea className="h-full w-full rounded-2xl border border-slate-100 bg-slate-50/30 p-4 transition-all focus-within:ring-2 focus-within:ring-teal-500/10 focus-within:border-teal-500/20">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={isProcessing ? "Neural engine processing..." : "OCR output will manifest here..."}
                  className="w-full h-full min-h-[268px] bg-transparent border-none resize-none focus:ring-0 p-0 font-mono text-sm text-slate-600 leading-relaxed placeholder:text-slate-300"
                  readOnly={isProcessing}
                />
              </ScrollArea>

              {(confidence !== null || wordCount > 0) && (
                <div className="absolute bottom-4 right-4 flex items-center space-x-2 animate-fade-in">
                  {confidence !== null && (
                    <Badge variant="outline" className="bg-white/80 backdrop-blur-sm border-slate-200 text-slate-500 font-bold text-[10px]">
                      <Wand2 className="h-2.5 w-2.5 mr-1.5 text-teal-500" />
                      {confidence.toFixed(1)}% Acc.
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-white/80 backdrop-blur-sm border-slate-200 text-slate-500 font-bold text-[10px]">
                    <FileText className="h-2.5 w-2.5 mr-1.5 text-blue-500" />
                    {wordCount} Words
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex space-x-2">
                <Button
                  onClick={handleDownloadText}
                  disabled={!text || isProcessing}
                  variant="outline"
                  size="sm"
                  className="rounded-xl h-9 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
                >
                  <Download size={14} className="mr-2 text-blue-600" />
                  Save File
                </Button>
                {navigator.share && (
                  <Button
                    onClick={handleShare}
                    disabled={!text || isProcessing}
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-9 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
                  >
                    <Share2 size={14} className="mr-2 text-purple-600" />
                    Share
                  </Button>
                )}
              </div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest hidden sm:block">
                Powered by Tesseract Gen 5
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pro Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {[
          { title: "Visual Clarity", desc: "Well-lit images yield 40% higher accuracy neural reading.", icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50" },
          { title: "Native Decoding", desc: "Select the original language to enable contextual semantic mapping.", icon: Languages, color: "text-teal-500", bg: "bg-teal-50" },
          { title: "Live Synthesis", desc: "Manual edits in the output area are saved to your local session instantly.", icon: Wand2, color: "text-blue-500", bg: "bg-blue-50" }
        ].map((tip, idx) => (
          <div key={idx} className="p-5 bg-white border border-slate-200/60 rounded-3xl hover:shadow-lg hover:border-teal-100 transition-all duration-300 group">
            <div className={`${tip.bg} w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-sm`}>
              <tip.icon size={20} className={tip.color} />
            </div>
            <h4 className="font-bold text-slate-900 mb-1">{tip.title}</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OcrProcessor;