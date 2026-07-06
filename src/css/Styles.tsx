import { StyleSheet } from 'react-native';

// NOTE: Color values are now in src/context/ThemeContext.tsx
// This file contains ONLY layout/geometry styles that never change with theme.

const styles = StyleSheet.create({

  // ─── Shell ────────────────────────────────────────────────────────────────
  screen: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // ─── Two-row branded top header ───────────────────────────────────────────
  topHeader: {
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
    paddingHorizontal: 20,
  },

  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  wordmarkWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 1,
  },

  wordmark: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  wordmarkAccent: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  stepPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },

  stepPillText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  // ─── Icon buttons (back + theme toggle) ───────────────────────────────────
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backArrow: {
    fontSize: 18,
    marginTop: -1,
  },

  // ─── Hero (unused — kept as a shell for future use) ───────────────────────
  hero: {
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 4,
  },

  heroCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: 0.2,
  },

  heroSubtitle: {
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
    textAlign: 'center',
    width: '80%',
  },

  // ─── Blobs ────────────────────────────────────────────────────────────────
  blob: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
  },

  blobLarge: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
  },

  // ─── Legacy / compatibility ────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 8,
    minHeight: 52,
  },
  shell: {
    flex: 1,
    padding: 20,
    paddingBottom: 18,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 52,
  },
  brand: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: 3,
    textTransform: 'uppercase',
  },
  backButton: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backText: {
    fontSize: 14,
    fontWeight: '900',
  },
  progressTrack: {
    flexDirection: 'row',
    gap: 8,
    height: 8,
    marginTop: 10,
  },
  progressDot: {
    borderRadius: 8,
  },
  panel: {
    flex: 1,
    paddingTop: 18,
  },
  page: {
    flex: 1,
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 36,
  },
  titleCompact: {
    fontSize: 25,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    maxWidth: 620,
  },
  subtitleCompact: {
    fontSize: 13,
    lineHeight: 19,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  optionCard: {
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'space-between',
    padding: 14,
  },
  optionAccent: {
    borderRadius: 8,
    height: 8,
    width: 44,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 22,
    marginTop: 12,
  },
  optionLabelCompact: {
    fontSize: 16,
    lineHeight: 20,
  },
  optionDetail: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  quotePage: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  quoteCard: {
    borderRadius: 20,
    borderWidth: 1,
    gap: 10,
    padding: 22,
    width: '100%',
  },
  quoteMark: {
    fontSize: 42,
    fontWeight: '900',
    lineHeight: 48,
  },
  quote: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 30,
  },
  quoteCompact: {
    fontSize: 19,
    lineHeight: 27,
  },
  quoteMeta: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  actions: {
    gap: 10,
    width: '100%',
  },
  primaryAction: {
    alignItems: 'center',
    borderRadius: 14,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryAction: {
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  secondaryActionText: {
    fontSize: 15,
    fontWeight: '800',
  },
});

export default styles;