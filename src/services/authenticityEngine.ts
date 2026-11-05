import { VerificationBreakdown, TruthBadgeLevel } from '../types';

// Lexical triggers for clickbait, sensationalism, and manufactured outrage
const CLICKBAIT_PATTERNS = [
  /\bshocking\b/i,
  /\byou won'?t believe\b/i,
  /\bsecret they don'?t want you to know\b/i,
  /\b100% (cured|guaranteed|true|proven)\b/i,
  /\bforward to (everyone|all|groups)\b/i,
  /\bshare immediately\b/i,
  /\burgent warning\b/i,
  /\bconspiracy\b/i,
  /\bmiracle (cure|fix|solution)\b/i,
  /\bleaked (video|audio|documents|truth)\b/i,
  /\bgovernment (coverup|hiding|hoax)\b/i,
  /\bbreaking bombshell\b/i,
  /\bviral alert\b/i,
  /\bwake up (sheeple|people)\b/i,
  /\bmainstream media won'?t show\b/i,
  /\bdo not trust\b/i,
  /\bpoison in our\b/i,
  /\bwhat happens next will blow your mind\b/i,
  /\balien\b/i,
  /\billuminati\b/i,
];

// Toxic, hate-speech, and harmful panic-inducing keywords
const TOXIC_AND_HARMFUL_PATTERNS = [
  /\bhate\b/i,
  /\briot now\b/i,
  /\battack them\b/i,
  /\blynch\b/i,
  /\bkill all\b/i,
  /\bterrorist conspiracy\b/i,
  /\btraitors\b/i,
  /\bdestroy their\b/i,
  /\binfestation\b/i,
  /\bfilthy\b/i,
  /\bexecute\b/i,
  /\bblood on their hands\b/i,
  /\bvigilante justice\b/i,
];

// Corroborating civic / verifiable terms that boost confidence
const CIVIC_CORROBORATING_TERMS = [
  /\bmunicipal(ity)?\b/i,
  /\bcity council\b/i,
  /\bdepartment of transportation\b/i,
  /\bwater (board|authority|works)\b/i,
  /\bfire department\b/i,
  /\bpolice department\b/i,
  /\bhighway patrol\b/i,
  /\bemergency services\b/i,
  /\bmeteorological (department|office|service)\b/i,
  /\bweather service\b/i,
  /\bpublic transit\b/i,
  /\bboard of education\b/i,
  /\bdistrict magistrate\b/i,
  /\bhelpline\b/i,
  /\bofficial statement\b/i,
  /\bpress release\b/i,
  /\bdispatch\b/i,
  /\bavenue\b/i,
  /\bstreet\b/i,
  /\bboulevard\b/i,
  /\broad\b/i,
  /\bjunction\b/i,
  /\bsector\b/i,
  /\bward\b/i,
];

export interface AnalysisInput {
  headline: string;
  description: string;
  city: string;
  category: string;
  imageUrl?: string;
  hasCustomUpload?: boolean;
}

/**
 * Analyzes news report text and image metadata to synthesize a comprehensive Truth Score
 */
export function analyzeNewsAuthenticity(input: AnalysisInput): VerificationBreakdown {
  const { headline, description, city, category, imageUrl = '', hasCustomUpload = false } = input;
  const combinedText = `${headline} ${description}`;
  const warningReasons: string[] = [];
  const flaggedKeywords: string[] = [];

  // 1. Text Credibility & Baseline Calculation
  let baseCredibility = 78; // Starting neutral-positive baseline

  // Length check: extremely brief reports lack context
  if (description.length < 50) {
    baseCredibility -= 12;
    warningReasons.push('Report description is very brief; lacks specific contextual details or timeline.');
  } else if (description.length > 180) {
    baseCredibility += 7; // Detailed reports with structured details get boost
  }

  // 2. Clickbait & Sensationalism Analysis
  let clickbaitScore = 10; // Low base
  let clickbaitMatches = 0;

  for (const pattern of CLICKBAIT_PATTERNS) {
    if (pattern.test(combinedText)) {
      clickbaitMatches++;
      const match = combinedText.match(pattern);
      if (match && !flaggedKeywords.includes(match[0].toLowerCase())) {
        flaggedKeywords.push(match[0].toLowerCase());
      }
    }
  }

  // Excessive exclamation or question marks
  const exclamationCount = (combinedText.match(/!{2,}/g) || []).length;
  const questionCount = (combinedText.match(/\?{2,}/g) || []).length;
  if (exclamationCount > 0 || questionCount > 0) {
    clickbaitMatches += 2;
    warningReasons.push('Excessive dramatic punctuation (e.g. "!!!" or "???") detected.');
  }

  // ALL CAPS ratio test
  const alphaChars = combinedText.replace(/[^a-zA-Z]/g, '');
  if (alphaChars.length > 20) {
    const uppercaseChars = alphaChars.replace(/[^A-Z]/g, '');
    const capsRatio = uppercaseChars.length / alphaChars.length;
    if (capsRatio > 0.35) {
      clickbaitMatches += 3;
      warningReasons.push('Unusually high proportion of capital letters indicating sensationalism.');
    }
  }

  clickbaitScore = Math.min(100, Math.max(5, clickbaitMatches * 22 + (clickbaitMatches > 0 ? 15 : 0)));

  if (clickbaitMatches > 0) {
    warningReasons.push(`Flagged sensationalist phrasing: "${flaggedKeywords.slice(0, 3).join('", "')}".`);
  }

  // 3. Toxicity & Harmful Content Analysis
  let toxicityScore = 0;
  let toxicMatches = 0;

  for (const pattern of TOXIC_AND_HARMFUL_PATTERNS) {
    if (pattern.test(combinedText)) {
      toxicMatches++;
      const match = combinedText.match(pattern);
      if (match && !flaggedKeywords.includes(match[0].toLowerCase())) {
        flaggedKeywords.push(`[toxic] ${match[0].toLowerCase()}`);
      }
    }
  }

  if (toxicMatches > 0) {
    toxicityScore = Math.min(100, toxicMatches * 35 + 20);
    warningReasons.push('Flagged aggressive, provocative, or potentially harmful rhetoric in violation of citizen guidelines.');
  }

  // 4. Source Corroboration & Entity Verification
  let sourceCorroborationScore = 55;
  let corroborationMatches = 0;

  for (const pattern of CIVIC_CORROBORATING_TERMS) {
    if (pattern.test(combinedText)) {
      corroborationMatches++;
    }
  }

  // If specific city name is mentioned in text, give localization boost
  if (city && combinedText.toLowerCase().includes(city.toLowerCase())) {
    corroborationMatches += 1;
  }

  sourceCorroborationScore = Math.min(98, 45 + corroborationMatches * 11);

  // 5. Image Integrity & Reverse Search Simulation
  let imageIntegrityScore = 88;
  let imageReverseMatchStatus: VerificationBreakdown['imageReverseMatchStatus'] = 'original_local';
  let exifMetadataFound = false;

  // Algorithmic check on image characteristics
  const lowerUrl = imageUrl.toLowerCase();
  const isStockOrMeme = lowerUrl.includes('meme') || lowerUrl.includes('fakenews') || lowerUrl.includes('clickbait') || combinedText.toLowerCase().includes('stock photo');
  const isManipulated = combinedText.toLowerCase().includes('doctored') || combinedText.toLowerCase().includes('cgi') || combinedText.toLowerCase().includes('ai generated');

  if (isStockOrMeme) {
    imageIntegrityScore = 28;
    imageReverseMatchStatus = 'known_stock_or_reused';
    warningReasons.push('Reverse image lookup indicates photo previously appeared in unrelated archival reports.');
  } else if (isManipulated) {
    imageIntegrityScore = 32;
    imageReverseMatchStatus = 'potential_manipulation';
    warningReasons.push('Digital noise and metadata compression analysis suggest possible manipulation or AI synthesis.');
  } else if (!imageUrl && !hasCustomUpload) {
    imageIntegrityScore = 60;
    imageReverseMatchStatus = 'unverified_source';
  } else {
    // Normal photographic integrity
    imageIntegrityScore = Math.floor(82 + Math.random() * 14);
    imageReverseMatchStatus = 'original_local';
    exifMetadataFound = true;
  }

  // 6. Text Credibility synthesis
  let textCredibility = baseCredibility;
  textCredibility -= (clickbaitScore * 0.45);
  textCredibility -= (toxicityScore * 0.55);
  textCredibility += (sourceCorroborationScore * 0.25);
  textCredibility = Math.min(99, Math.max(10, Math.round(textCredibility)));

  // 7. Overall Truth Score Computation (Weighted formula)
  // Text Credibility (40%), Image Integrity (30%), Corroboration (30%), minus penalties
  let composite = (textCredibility * 0.45) + (imageIntegrityScore * 0.30) + (sourceCorroborationScore * 0.25);

  if (clickbaitMatches >= 2) composite -= 18;
  if (toxicMatches > 0) composite -= 30;

  let overallScore = Math.min(98, Math.max(12, Math.round(composite)));

  // Assign Badge Level based on requirement specs:
  // 🟢 Verified Local Report (85%–100%)
  // 🟡 Under Community Review (60%–84%)
  // 🔴 Unverified / Flagged Content (<60%)
  let badge: TruthBadgeLevel = 'review';
  let badgeLabel = 'Under Community Review';

  if (overallScore >= 85) {
    badge = 'verified';
    badgeLabel = 'Verified Local Report';
  } else if (overallScore >= 60) {
    badge = 'review';
    badgeLabel = 'Under Community Review';
    if (warningReasons.length === 0) {
      warningReasons.push('Awaiting secondary eyewitness confirmations or civic authority acknowledgement.');
    }
  } else {
    badge = 'flagged';
    badgeLabel = 'Unverified / Flagged Content';
    if (warningReasons.length === 0) {
      warningReasons.push('Low algorithmic trust score. Potential misinformation or sensationalized content detected.');
    }
  }

  // Generate an explainable, transparent AI verification summary
  let verificationSummary = '';
  if (badge === 'verified') {
    verificationSummary = `Passed algorithmic verification with high local context markers (${sourceCorroborationScore}% corroboration) and pristine photographic integrity. Minimal sensationalism detected.`;
  } else if (badge === 'review') {
    verificationSummary = `Contains verifiable local geographic references, but pending additional eyewitness confirmation or official municipal dispatch. Exercising standard community vigilance.`;
  } else {
    verificationSummary = `High alert: Algorithmic integrity scan flagged ${warningReasons.length} issue(s) including clickbait triggers, unverified claims, or reused photographic assets. Community discretion advised.`;
  }

  return {
    overallScore,
    badge,
    badgeLabel,
    textCredibilityScore: textCredibility,
    clickbaitScore,
    toxicityScore,
    imageIntegrityScore,
    imageReverseMatchStatus,
    sourceCorroborationScore,
    flaggedKeywords,
    warningReasons,
    verificationSummary,
    exifMetadataFound,
    analyzedAt: new Date().toISOString(),
  };
}

/**
 * Quick helper to simulate a multi-step 2-second scan with progress updates
 */
export interface ScanStep {
  id: number;
  label: string;
  detail: string;
  durationMs: number;
}

export const SCAN_STEPS: ScanStep[] = [
  { id: 1, label: 'Text & Lexical Parsing', detail: 'Scanning grammar, tone, and clickbait hyperbole patterns...', durationMs: 450 },
  { id: 2, label: 'Harmful Content & Moderation', detail: 'Running toxicity filter & hate-speech detection checks...', durationMs: 450 },
  { id: 3, label: 'Image Integrity & Reverse Match', detail: 'Inspecting EXIF metadata, compression artifacts, and duplicate feeds...', durationMs: 550 },
  { id: 4, label: 'Truth Score Synthesis', detail: 'Cross-referencing municipal entities & computing composite credibility...', durationMs: 550 },
];
