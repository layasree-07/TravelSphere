import React, { useState } from 'react';
import { Destination, PlaceVerificationResult } from '../types/travel';
import { INDIAN_STATES_LIST, buildGoogleMapsUrl, getPlaceImage, verifyPlaceInClient } from '../data/indianPlacesData';
import { 
  X, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Navigation, 
  ExternalLink, 
  Loader2, 
  Plus, 
  RefreshCw,
  Info,
  Ban,
  Database,
  ShieldAlert,
  Lock
} from 'lucide-react';

interface AddPlaceModalProps {
  onClose: () => void;
  onAddPlace: (newPlace: Destination) => void;
}

export const AddPlaceModal: React.FC<AddPlaceModalProps> = ({ onClose, onAddPlace }) => {
  const [placeName, setPlaceName] = useState('');
  const [selectedState, setSelectedState] = useState(INDIAN_STATES_LIST[0]);
  const [country, setCountry] = useState('India');
  const [significance, setSignificance] = useState('');
  const [category, setCategory] = useState('Spiritual');
  const [bestSeason, setBestSeason] = useState('October – March');
  const [imageUrl, setImageUrl] = useState('');
  const [startingPrice, setStartingPrice] = useState(450);

  // AI Verification States
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<PlaceVerificationResult | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Dynamic Google Maps URL
  const currentGoogleMapsUrl = buildGoogleMapsUrl(
    placeName || 'India Gate', 
    selectedState, 
    country
  );

  // Core verification engine runner
  const executePlaceVerification = async (
    targetPlace: string,
    targetState: string,
    targetSig: string
  ): Promise<PlaceVerificationResult> => {
    try {
      const response = await fetch('/api/verify-place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeName: targetPlace.trim(),
          state: targetState,
          country: country.trim(),
          significance: targetSig.trim(),
          category
        }),
      });

      if (response.ok) {
        const data: PlaceVerificationResult = await response.json();
        return data;
      }
    } catch (err) {
      console.warn('Backend verification call failed, using client verification engine:', err);
    }

    // Client-side fallback verification
    return verifyPlaceInClient(
      targetPlace.trim(),
      targetState,
      country.trim() || 'India',
      targetSig.trim(),
      category
    );
  };

  // Trigger Server-side AI Verification
  const handleVerifyWithAi = async () => {
    if (!placeName.trim()) {
      setVerificationError('Please enter a place or landmark name first to verify with AI.');
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);

    try {
      const result = await executePlaceVerification(placeName, selectedState, significance);
      setVerificationResult(result);

      if (result.isValid) {
        if (!bestSeason && result.suggestedSeason) {
          setBestSeason(result.suggestedSeason);
        }
        if (!imageUrl && result.suggestedImageUrl) {
          setImageUrl(result.suggestedImageUrl);
        }
        if (result.significance && (!significance || significance.length < 50)) {
          setSignificance(result.significance);
        }
      } else {
        setVerificationError(`"${placeName.trim()}" could not be recognized as an authentic destination. AI cannot verify its significance.`);
      }
    } catch (err: any) {
      setVerificationError('Verification check encountered a temporary error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Fetch verified Wikipedia Media & 5-Sentence Extract
  const [isFetchingWiki, setIsFetchingWiki] = useState(false);
  const handleFetchFromWikipedia = async () => {
    if (!placeName.trim()) {
      setVerificationError('Please enter a place name first to fetch Wikipedia details.');
      return;
    }
    setIsFetchingWiki(true);
    setVerificationError(null);
    try {
      const res = await fetch(`/api/wiki-place?title=${encodeURIComponent(placeName.trim())}&state=${encodeURIComponent(selectedState)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.imageUrl) {
          setImageUrl(data.imageUrl);
        }
        if (data.extract) {
          setSignificance(data.extract);
        }
        if (data.title && !placeName.toLowerCase().includes(data.title.toLowerCase())) {
          setPlaceName(data.title);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch Wikipedia data:', err);
    } finally {
      setIsFetchingWiki(false);
    }
  };

  // Apply AI corrections if suggested
  const handleApplyAiCorrections = () => {
    if (!verificationResult) return;
    if (verificationResult.correctedPlaceName || verificationResult.placeName) {
      setPlaceName(verificationResult.correctedPlaceName || verificationResult.placeName);
    }
    if (verificationResult.state && INDIAN_STATES_LIST.includes(verificationResult.state)) {
      setSelectedState(verificationResult.state);
    }
    if (verificationResult.significance) {
      setSignificance(verificationResult.significance);
    }
    if (verificationResult.suggestedSeason) {
      setBestSeason(verificationResult.suggestedSeason);
    }
    if (verificationResult.suggestedImageUrl && !imageUrl) {
      setImageUrl(verificationResult.suggestedImageUrl);
    }
    setVerificationError(null);
  };

  // Submit and Add Place with mandatory verification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = placeName.trim();
    if (!trimmedName) {
      setVerificationError('Place name cannot be empty.');
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);

    try {
      // 1. Perform AI check on the place and its significance
      let result = verificationResult;
      const needsFreshCheck = !result || 
        result.placeName.toLowerCase() !== trimmedName.toLowerCase() ||
        result.state.toLowerCase() !== selectedState.toLowerCase();

      if (needsFreshCheck) {
        result = await executePlaceVerification(trimmedName, selectedState, significance);
        setVerificationResult(result);
      }

      // 2. Strictly check authenticity: If invalid (e.g. "xyz"), reject addition!
      if (!result || !result.isValid) {
        setVerificationError(
          `❌ Cannot Add Destination: "${trimmedName}" was rejected by AI verification. It is not recognized as a genuine tourist landmark or geographical destination. Only authentic destinations can be added.`
        );
        return;
      }

      // 3. Significance check: If user provided significance has a mismatch or is empty, adopt the verified significance
      let finalSignificance = significance.trim();
      if (!finalSignificance || result.userSignificanceAnalysis?.status === 'MISMATCH_DETECTED') {
        finalSignificance = result.significance || finalSignificance;
      }

      const cleanId = `custom-dest-${Date.now()}`;
      const defaultImage = imageUrl.trim() || result.suggestedImageUrl || getPlaceImage(trimmedName, selectedState);

      const tags = ['India', selectedState, category];
      if (result.suggestedTags) {
        result.suggestedTags.forEach((t) => {
          if (!tags.includes(t)) tags.push(t);
        });
      }

      const newDestination: Destination = {
        id: cleanId,
        name: result.correctedPlaceName || trimmedName,
        state: selectedState,
        country: country.trim() || 'India',
        continent: 'Asia',
        imageUrl: defaultImage,
        rating: 4.9,
        reviewCount: 1,
        description: finalSignificance
          ? `${finalSignificance} Located in ${selectedState}, ${country}.`
          : `Explore ${trimmedName}, a remarkable destination located in ${selectedState}, ${country}.`,
        significance: finalSignificance || undefined,
        bestTimeToVisit: bestSeason || result.suggestedSeason || 'October – March',
        climate: result.suggestedClimate || 'Pleasant to Tropical',
        startingPrice: Number(startingPrice) || 450,
        tags: tags.slice(0, 4),
        featured: false,
        googleMapsUrl: result.googleMapsUrl || currentGoogleMapsUrl,
        verifiedByAi: true,
        verifiedNotes: result.aiExplanation || 'Verified destination and significance.',
        addedByUser: true
      };

      // Update persistent database of that place
      try {
        await fetch('/api/destinations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newDestination),
        });
      } catch (dbErr) {
        console.warn('Backend database write notification:', dbErr);
      }

      onAddPlace(newDestination);
      onClose();
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div 
        id="add-place-modal-container"
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-fade-in"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-700/20">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900">
                  Add New Place &amp; Destination
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-teal-600" />
                  AI Assisted
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Add public tourist spots across Indian states. Only attractions open to any visitor can be added (educational institutes and private campuses are prohibited).
              </p>
            </div>
          </div>

          <button
            id="close-add-place-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informative Tourism Policy Alert */}
        <div className="bg-sky-50 border-b border-sky-100 px-6 py-2 flex items-center gap-2 text-[11px] text-sky-800">
          <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span>
            <strong>Tourism Only Policy:</strong> AI will verify that the place is a real public tourist spot (e.g. monuments, waterfalls, temples, parks). Educational institutes, colleges, and private campuses are strictly blocked.
          </span>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 flex-1">
          {/* Row 1: Place Name & State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">
                Place / Landmark Name *
              </label>
              <input
                id="add-place-name-input"
                type="text"
                required
                placeholder="e.g. Ramappa Temple, Araku Valley"
                value={placeName}
                onChange={(e) => {
                  setPlaceName(e.target.value);
                  setVerificationResult(null);
                  setVerificationError(null);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">
                State (India) *
              </label>
              <select
                id="add-place-state-select"
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setVerificationResult(null);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              >
                {INDIAN_STATES_LIST.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Significance / Cultural Facts (Up to 5 Sentences) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span>Significance &amp; Heritage (Up to 5 Sentences)</span>
              </label>
              <button
                type="button"
                disabled={isFetchingWiki || !placeName.trim()}
                onClick={handleFetchFromWikipedia}
                className="text-[11px] font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 transition-colors disabled:opacity-40 cursor-pointer"
                title="Auto-fetch authentic 5-sentence extract and image from Wikipedia"
              >
                {isFetchingWiki ? (
                  <Loader2 className="w-3 h-3 animate-spin text-teal-600" />
                ) : (
                  <Sparkles className="w-3 h-3 text-teal-600" />
                )}
                <span>Auto-fetch from Wikipedia</span>
              </button>
            </div>
            <textarea
              id="add-place-significance-input"
              rows={3}
              placeholder="Provide up to 5 verified sentences highlighting historical origin, architectural style, cultural/spiritual importance, landscape geography, and key visitor appeal..."
              value={significance}
              onChange={(e) => setSignificance(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium leading-relaxed"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Tip: Click &quot;Auto-fetch from Wikipedia&quot; above to retrieve up to 5 authentic sentences and the verified Wikimedia photo.
            </p>
          </div>

          {/* Row 3: Category, Season & Starting Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">
                Category
              </label>
              <select
                id="add-place-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Spiritual">Spiritual &amp; Temples</option>
                <option value="Heritage">Heritage &amp; Forts</option>
                <option value="Nature">Nature &amp; Valleys</option>
                <option value="Wildlife">Wildlife &amp; Safari</option>
                <option value="Waterfall">Waterfalls</option>
                <option value="Caves">Caves &amp; Geology</option>
                <option value="Beach">Beach &amp; Coastal</option>
                <option value="Adventure">Adventure</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">
                Best Season
              </label>
              <input
                id="add-place-season-input"
                type="text"
                value={bestSeason}
                onChange={(e) => setBestSeason(e.target.value)}
                placeholder="e.g. October – March"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">
                Est. Price ($)
              </label>
              <input
                id="add-place-price-input"
                type="number"
                min="100"
                max="5000"
                value={startingPrice}
                onChange={(e) => setStartingPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Row 4: Google Maps Link Live Generator */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                <Navigation className="w-3.5 h-3.5 text-teal-600" />
                <span>Verified Google Maps Search Link</span>
              </div>
              <a
                id="test-gmaps-link-btn"
                href={currentGoogleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200 transition-colors"
              >
                <span>Test Live Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-slate-500 font-mono break-all bg-white p-2 rounded-lg border border-slate-200">
              {currentGoogleMapsUrl}
            </p>
          </div>

          {/* AI Fact Checking Banner & Action */}
          <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-2xl p-4 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span className="font-serif font-bold text-sm text-teal-200">
                    AI Travel Verification Engine
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 max-w-md">
                  Gemini checks that the place is authentic, validates the state and country, and verifies its geographical existence.
                </p>
              </div>

              <button
                id="verify-with-ai-btn"
                type="button"
                disabled={isVerifying || !placeName.trim()}
                onClick={handleVerifyWithAi}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Fact-checking...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>Check with AI</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Error Alert */}
            {verificationError && (
              <div className="mt-3 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{verificationError}</span>
              </div>
            )}

            {/* AI Check Status Notice when Not Yet Verified */}
            {!verificationResult && (
              <div className="mt-3 p-3 rounded-xl bg-teal-950/60 border border-teal-500/30 text-teal-200 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>AI Verification is required before adding. Click <strong>Check with AI</strong> to validate.</span>
                </div>
              </div>
            )}

            {/* AI Verification Results Card */}
            {verificationResult && (
              <div 
                id="ai-verification-result-box"
                className={`mt-4 p-4 rounded-xl border text-xs space-y-3 animate-fade-in ${
                  verificationResult.isValid 
                    ? 'bg-slate-800/90 border-teal-500/40' 
                    : 'bg-rose-950/80 border-rose-500/60'
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    {verificationResult.isValid ? (
                      verificationResult.verificationStatus === 'CORRECTIONS_SUGGESTED' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          Location Correction Suggested
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          AI Verified Authentic Landmark ({verificationResult.confidence}% Confidence)
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/30 border border-rose-400/60 text-rose-200 font-bold text-[11px]">
                        <Ban className="w-3.5 h-3.5 text-rose-400" />
                        AI Check Failed: Destination Rejected as Wrong / Invalid
                      </span>
                    )}
                  </div>

                  {verificationResult.isValid && (verificationResult.correctedPlaceName || verificationResult.state !== selectedState) && (
                    <button
                      type="button"
                      onClick={handleApplyAiCorrections}
                      className="text-[11px] text-teal-300 hover:text-teal-100 font-bold underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Apply AI Corrections
                    </button>
                  )}
                </div>

                <p className={`leading-relaxed text-[11px] ${verificationResult.isValid ? 'text-slate-200' : 'text-rose-200 font-semibold'}`}>
                  {verificationResult.aiExplanation}
                </p>

                {/* Explicit rejection notice if AI satisfied place as wrong */}
                {!verificationResult.isValid && (
                  <div className="p-3 rounded-lg bg-rose-900/60 border border-rose-600/60 text-rose-100 text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-rose-200">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span>Option to Add Blocked Permanently for this Input</span>
                    </div>
                    <p className="leading-relaxed opacity-95">
                      Because the AI check verified "{placeName}" as non-existent or fake, <strong>no option to add this place to the database will ever be given</strong>. To add a place, please enter a genuine, recognizable destination name.
                    </p>
                  </div>
                )}

                {/* Significance Check Analysis Box */}
                {verificationResult.userSignificanceAnalysis && (
                  <div className={`p-3 rounded-lg border ${
                    verificationResult.userSignificanceAnalysis.status === 'VERIFIED_ACCURATE'
                      ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                      : verificationResult.userSignificanceAnalysis.status === 'MISMATCH_DETECTED'
                      ? 'bg-amber-950/50 border-amber-500/40 text-amber-200'
                      : verificationResult.userSignificanceAnalysis.status === 'MISSING_OR_VAGUE'
                      ? 'bg-teal-950/50 border-teal-500/40 text-teal-200'
                      : 'bg-rose-900/40 border-rose-600/40 text-rose-200'
                  }`}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-[11px]">
                        {verificationResult.userSignificanceAnalysis.status === 'VERIFIED_ACCURATE' && (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Significance Verified Accurate</span>
                          </>
                        )}
                        {verificationResult.userSignificanceAnalysis.status === 'MISMATCH_DETECTED' && (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            <span>Significance Discrepancy Detected</span>
                          </>
                        )}
                        {verificationResult.userSignificanceAnalysis.status === 'MISSING_OR_VAGUE' && (
                          <>
                            <Info className="w-3.5 h-3.5 text-teal-400" />
                            <span>Authentic Significance Retrieved</span>
                          </>
                        )}
                        {verificationResult.userSignificanceAnalysis.status === 'INVALID' && (
                          <>
                            <X className="w-3.5 h-3.5 text-rose-400" />
                            <span>Significance Cannot Be Verified</span>
                          </>
                        )}
                      </div>

                      {verificationResult.userSignificanceAnalysis.suggestedSignificance && (
                        <button
                          type="button"
                          onClick={() => {
                            if (verificationResult?.userSignificanceAnalysis?.suggestedSignificance) {
                              setSignificance(verificationResult.userSignificanceAnalysis.suggestedSignificance);
                            }
                          }}
                          className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded font-bold transition-colors"
                        >
                          Use Verified Significance
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] opacity-90">
                      {verificationResult.userSignificanceAnalysis.feedback}
                    </p>
                  </div>
                )}

                {verificationResult.isValid && verificationResult.significance && (
                  <p className="text-slate-300 text-[11px] bg-slate-900/60 p-2.5 rounded-lg border border-slate-700">
                    <strong className="text-teal-300">Verified Landmark Record: </strong>
                    {verificationResult.significance}
                  </p>
                )}

                {verificationResult.isValid && verificationResult.suggestedImageUrl && (
                  <div className="flex items-center gap-3 p-2 bg-slate-900/60 rounded-lg border border-slate-700">
                    <img
                      src={verificationResult.suggestedImageUrl}
                      alt="Wikipedia preview"
                      referrerPolicy="no-referrer"
                      className="w-14 h-12 rounded-lg object-cover border border-slate-600 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-teal-300 truncate">
                        Wikipedia Verified Image
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {verificationResult.suggestedImageUrl}
                      </p>
                    </div>
                    {imageUrl !== verificationResult.suggestedImageUrl && (
                      <button
                        type="button"
                        onClick={() => setImageUrl(verificationResult.suggestedImageUrl!)}
                        className="text-[10px] bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-2.5 py-1 rounded-md transition-colors shrink-0"
                      >
                        Apply Photo
                      </button>
                    )}
                  </div>
                )}

                {verificationResult.isValid && verificationResult.suggestedTags && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="text-slate-400 text-[10px]">AI Tags:</span>
                    {verificationResult.suggestedTags.map((tag) => (
                      <span key={tag} className="bg-slate-700 text-teal-300 px-2 py-0.5 rounded text-[10px] font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              id="cancel-add-place-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors text-xs"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              {/* CASE 1: AI check verified the place as WRONG: NEVER GIVE OPTION TO ADD! */}
              {verificationResult && !verificationResult.isValid && (
                <div 
                  id="adding-strictly-blocked-badge"
                  className="px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <Ban className="w-4 h-4 text-rose-600" />
                  <span>Option to Add Blocked (Place is Invalid)</span>
                </div>
              )}

              {/* CASE 2: AI check NOT RUN YET: Give option to check authenticity first */}
              {!verificationResult && (
                <button
                  id="verify-landmark-first-btn"
                  type="button"
                  onClick={handleVerifyWithAi}
                  disabled={isVerifying || !placeName.trim()}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Checking with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Verify with AI to Enable Adding</span>
                    </>
                  )}
                </button>
              )}

              {/* CASE 3: AI check verified the place as CORRECT: UPDATE DATABASE OF THAT PLACE! */}
              {verificationResult && verificationResult.isValid && (
                <button
                  id="submit-add-place-btn"
                  type="submit"
                  disabled={isVerifying}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-700/30 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Updating Database...</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 text-emerald-200" />
                      <span>Update Database &amp; Save Destination</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
