import {
  StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
    color: '#102A43',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  stepText: {
    color: '#627D98',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: 3,
    textTransform: 'uppercase',
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D9E2EC',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backText: {
    color: '#243B53',
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
//   hero: {
//     flexShrink: 1,
//     gap: 8,
//     paddingTop: 12,
//   },
  eyebrow: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: '#102A43',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 39,
  },
  titleCompact: {
    fontSize: 29,
    lineHeight: 34,
  },
  subtitle: {
    color: '#52606D',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 23,
    maxWidth: 620,
  },
  subtitleCompact: {
    fontSize: 14,
    lineHeight: 20,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
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
    color: '#102A43',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 24,
    marginTop: 14,
  },
  optionLabelCompact: {
    fontSize: 17,
    lineHeight: 21,
  },
  optionDetail: {
    color: '#627D98',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: 10,
    textTransform: 'uppercase',
  },
  quotePage: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  quoteAura: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    height: 104,
    justifyContent: 'center',
    width: 146,
  },
  auraText: {
    fontSize: 24,
    fontWeight: '900',
  },
  quoteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 22,
    width: '100%',
  },
  quoteMark: {
    fontSize: 48,
    fontWeight: '900',
    lineHeight: 48,
  },
  quote: {
    color: '#102A43',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 33,
  },
  quoteCompact: {
    fontSize: 20,
    lineHeight: 28,
  },
  quoteMeta: {
    color: '#627D98',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  actions: {
    gap: 10,
    width: '100%',
  },
  primaryAction: {
    alignItems: 'center',
    borderRadius: 8,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  secondaryAction: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D9E2EC',
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  secondaryActionText: {
    color: '#243B53',
    fontSize: 15,
    fontWeight: '900',
  },

  screen:{
    flex:1,
    backgroundColor:"#F8FAFC"
},

container:{
    flex:1,
    paddingHorizontal:22
},

header:{
    flexDirection:"row",
    alignItems:"center",
    marginTop:12,
    marginBottom:10
},

logo:{
    fontSize:26,
    fontWeight:"800",
    color:"#111827",
    flex:1,
    textAlign:"center",
    marginRight:40
},

backCircle:{
    width:42,
    height:42,
    borderRadius:21,
    backgroundColor:"#FFFFFF",
    justifyContent:"center",
    alignItems:"center",
    elevation:4
},

backArrow:{
    fontSize:22
},

hero:{
    alignItems:"center",
    marginBottom:18
},

heroCircle:{
    width:110,
    height:110,
    borderRadius:55,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#FFFFFF",
    elevation:6,
    marginBottom:18
},

heroTitle:{
    fontSize:30,
    fontWeight:"800",
    color:"#111827",
    textAlign:"center",
    lineHeight:38
},

heroSubtitle:{
    fontSize:15,
    color:"#6B7280",
    marginTop:10,
    lineHeight:24,
    textAlign:"center",
    width:"85%"
},

blob:{
    position:"absolute",
    width:240,
    height:240,
    borderRadius:120
},

blobLarge:{
    position:"absolute",
    width:300,
    height:300,
    borderRadius:150
}
});

export default styles;