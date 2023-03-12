import { StatusBar } from 'expo-status-bar';
import {Fontisto} from "@expo/vector-icons"
import * as Location from "expo-location";
import React,{useEffect,useState} from "react";
import { StyleSheet, Text, View, Dimensions, ScrollView,ActivityIndicator } from 'react-native';

const {width: SCREEN_WIDTH}=Dimensions.get("window");
const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";

const icons={Clouds:"cloudy",Clear:"day-sunny",Atmosphere:"cloudy-gusts",Snow:"snow",
Rain:"rains",Drizzle: "rain",
Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity]=useState("Loading...");
  const [days,setDays]=useState([]);
  const [ok,setOk]=useState(true);
  const getWeather=async()=>{
    const{granted}=await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const{
      coords:{latitude,longitude},
    }=await Location.getCurrentPositionAsync({accuracy:5});
    const location=await Location.reverseGeocodeAsync(
      {latitude, longitude},{useGoogleMaps:false}
    );
    setCity(location[0].city);
    const response=await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json=await response.json();
    setDays(json.daily);
  };
  useEffect(()=>{getWeather();},[]);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weather}>
        {days.length===0?(<View style={{...styles.day, alignItems:"center"}}>
          <ActivityIndicator color="white" style={{marginTop:10}} size="large"></ActivityIndicator>
        </View>) : (days.map((day,index)=> (<View key={index} style={styles.day}>
          <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(day.temp.day).toFixed(1)}
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={68}
                  color="white"
                />
              </View>

          <Text style={styles.description}>{day.weather[0].main}</Text>
          <Text style={styles.tinyText}>{day.weather[0].description}</Text>
        </View>
        ))
        )}
      </ScrollView>

      <StatusBar style='light'></StatusBar>
    </View>
  );
}

const styles=StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"skyblue"
  },
  city:{
    flex:1.2,
    justifyContent:"center",
    alignItems:"center"
  },
  cityName:{
    fontSize:68,
    fontWeight:"500",
    color:"white",
  },
  weather:{
    
  },
  day:{
    width:SCREEN_WIDTH,  
    alignItems:"flex-start",
    paddingHorizontal:20,

  },
  temp:{fontSize:100,
    marginTop:50,
    fontWeight:"500",
    color:"white",
  },
  description:{
    marginTop:-30,
    fontSize:60,
    color:"white",
    fontWeight:"400",
  },
  tinyText:{fontSize:25,color:"white",fontWeight:"400"},

})