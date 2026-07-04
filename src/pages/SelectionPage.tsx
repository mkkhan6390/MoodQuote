import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import OptionCard from '../components/Optioncard';

export default function PickerPage({
  color,
  columns,
  compact,
  eyebrow,
  options,
  subtitle,
  title,
//   illustration = '📚',
}: {
  color: string;
  columns: number;
  compact: boolean;
  eyebrow: string;
  options: {
    accent: string;
    detail: string;
    id: string;
    label: string;
    icon?: string;
    onPress: () => void;
  }[];
  subtitle: string;
  title: string;
//   illustration?: string;
}) {

  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade,{
      toValue:1,
      duration:500,
      useNativeDriver:true
    }).start();
  },[]);

  return (

    <Animated.View
      style={{
        flex:1,
        opacity:fade,
        transform:[
          {
            translateY:fade.interpolate({
              inputRange:[0,1],
              outputRange:[20,0]
            })
          }
        ]
      }}
    >

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >

        {/* Hero */}

        <View style={styles.hero}>

          {/* <View
            style={[
              styles.heroIcon,
              {
                backgroundColor:`${color}15`
              }
            ]}
          >
            <Text style={styles.emoji}>
              {/* {illustration} 
            </Text>
          </View> */}

          <Text style={styles.title}>
            {title}
          </Text>

          {/* <Text style={styles.subtitle}>
            {subtitle}
          </Text> */}

        </View>

        {/* Badge */}

        {/* <View
          style={[
            styles.badge,
            {
              backgroundColor:`${color}15`
            }
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              {
                color
              }
            ]}
          >
            {eyebrow}
          </Text>
        </View> */}

        {/* Grid */}

        <View style={styles.grid}>

          {options.map((item,index)=>

            <OptionCard

              key={item.id}

              {...item}

              compact={compact}

              columns={columns}

              delay={index*70}

            />

          )}

        </View>

      </ScrollView>

    </Animated.View>

  );

}

const styles=StyleSheet.create({

container:{
paddingBottom:40
},

hero:{
alignItems:"center",
marginBottom:18
},

heroIcon:{
width:90,
height:90,
borderRadius:45,
justifyContent:"center",
alignItems:"center",
marginBottom:16
},

emoji:{
fontSize:42
},

title:{
fontSize:28,
fontWeight:"800",
color:"#111827",
textAlign:"center"
},

subtitle:{
marginTop:8,
fontSize:15,
lineHeight:22,
color:"#6B7280",
textAlign:"center",
paddingHorizontal:20
},

badge:{
alignSelf:"flex-start",
paddingHorizontal:16,
paddingVertical:8,
borderRadius:30,
marginBottom:18
},

badgeText:{
fontWeight:"700",
fontSize:13,
letterSpacing:.6,
textTransform:"uppercase"
},

grid:{
gap:12
}

});