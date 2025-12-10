import React, { useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Brain, Heart, Moon, Play, Sparkles } from "lucide-react-native";
const { width } = Dimensions.get("window");
const API_BASE_URL = 'http://192.168.219.138:8080';
const getYouTubeThumbnail = (url: string) => {
  if (!url) return "https://via.placeholder.com/150";
  try {
    // URL 형식에 따라 비디오 ID 추출 (v=XXXXX)
    const videoId = url.split('v=')[1]?.split('&')[0];
    return videoId 
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` 
      : "https://via.placeholder.com/150";
  } catch (e) {
    return "https://via.placeholder.com/150";
  }
};
export default function DreamInterpretationScreen() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<"input" | "loading" | "results">("input");
  const [dreamInput, setDreamInput] = useState("");
  const [resultData, setResultData] = useState<any>(null);

  const handleInterpretDream = async () => {
    if (!dreamInput.trim()) return;
    setCurrentView("loading");
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${API_BASE_URL}/api/dreams`,
        { 
          title: "새로운 꿈", 
          content: dreamInput,
          date: new Date().toISOString()
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' 
          }
        }
      );

      console.log("✅ 서버 원본 응답:", response.data);
      const serverItem = response.data.data[0]; 
      if (!serverItem) throw new Error("분석된 데이터가 없습니다.");

      const mappedData = {
        interpretation: serverItem.interpretation, 
        emotion: {
          primary: serverItem.emotionCategory, 
          secondary: "AI Analysis", 
          description: serverItem.emotionalAnalysis 
        },
        musicRecommendations: [
          {
            id: 1,
            title: serverItem.recommendedSongName,  
            artist: serverItem.recommendedArtist,    
            url: serverItem.recommendedSongUrl,  
            thumbnail: getYouTubeThumbnail(serverItem.recommendedSongUrl) 
          }
        ]
      };

      setResultData(mappedData);
      setCurrentView("results");

    } catch (error: any) {
      console.error("처리 실패:", error);
      Alert.alert("오류", "꿈 해석 결과를 불러오지 못했습니다.");
      setCurrentView("input");
    }
  };

  const resetToInput = () => {
    setDreamInput("");
    setResultData(null);
    setCurrentView("input");
  };
  const AnimatedDot = ({ delay }: { delay: number }) => {
    const opacity = React.useRef(new Animated.Value(0.3)).current;

    React.useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 400,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, []);

    return <Animated.View style={[styles.dot, { opacity }]} />;
  };

  return (
    <View style={styles.screen}>
      {currentView === "input" && (
        <ScrollView>
          <LinearGradient colors={["#8A2BE2", "#9370DB"]} style={styles.header}>
            <View style={styles.headerCenter}>
              <Moon size={48} color="#fff" strokeWidth={1.5} />
              <Text style={styles.headerTitle}>DreamScape AI</Text>
              <Text style={styles.headerSubtitle}>
                Discover the hidden meanings behind your dreams
              </Text>
            </View>
          </LinearGradient>
          <View style={styles.section}>
            <View style={styles.block}>
              <Text style={styles.inputTitle}>꿈을 입력하세요</Text>
              <Text style={styles.inputSubtitle}>
                자세히 적을수록 더 정확한 해석을 제공합니다
              </Text>
            </View>

            <View style={styles.inputCard}>
              <TextInput
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                placeholder="어젯밤 꾼 꿈을 여기에 적어주세요..."
                placeholderTextColor="#B19CD9"
                style={styles.inputField}
                value={dreamInput}
                onChangeText={setDreamInput}
              />
            </View>

            <TouchableOpacity
              disabled={!dreamInput.trim()}
              onPress={handleInterpretDream}
              style={[
                styles.buttonPrimary,
                !dreamInput.trim() && { opacity: 0.4 },
              ]}
            >
              <Text style={styles.buttonPrimaryText}>해몽 시작</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {currentView === "loading" && (
        <View style={styles.loadingScreen}>
          <LinearGradient colors={["#8A2BE2", "#9370DB"]} style={styles.loadingBox}>
            <Sparkles size={64} color="#fff" strokeWidth={1.5} style={{ marginBottom: 20 }} />
            <Text style={styles.loadingTitle}>당신의 꿈을 해석 중입니다...</Text>
            <Text style={styles.loadingSubtitle}>
              AI가 꿈의 의미와 감정을 분석하고 있습니다
            </Text>

          <View style={styles.dots}>
            <AnimatedDot delay={0} />
            <AnimatedDot delay={200} />
            <AnimatedDot delay={400} />
          </View>
          </LinearGradient>

          <TouchableOpacity onPress={resetToInput} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentView === "results" && resultData && (
        <ScrollView>
          {/* Header */}
          <LinearGradient colors={["#8A2BE2", "#9370DB"]} style={styles.resultsHeader}>
            <View style={styles.resultsHeaderRow}>
              <Text style={styles.resultsHeaderText}>해석 결과</Text>
              <TouchableOpacity onPress={resetToInput} style={styles.restartButton}>
                <Text style={{ color: "#fff" }}>다시 하기</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View style={styles.section}>
            <View style={styles.card}>
              <View style={styles.rowCenter}>
                <Brain size={24} color="#8A2BE2" />
                <Text style={styles.cardTitle}>꿈 해석</Text>
              </View>
              <Text style={styles.cardText}>{resultData.interpretation}</Text>           
            </View>
            <LinearGradient colors={["#A78BFA", "#6366F1"]} style={styles.emotionCard}>
              <View style={styles.rowCenter}>
                <Heart size={24} color="#fff" />
                <Text style={styles.emotionCardTitle}>감정 분석</Text>
              </View>
              <View style={styles.emotionMainRow}>
                <Text style={styles.emotionPrimary}>{resultData.emotion.primary}</Text>
                <Text style={styles.emotionSecondary}>• {resultData.emotion.secondary}</Text>
              </View>
              <Text style={styles.emotionDesc}>{resultData.emotion.description}</Text>            
            </LinearGradient>
            <View style={{ marginBottom: 20 }}>
              <View style={styles.rowCenter}>
                <Play size={24} color="#8A2BE2" />
                <Text style={styles.cardTitle}>음악 추천</Text>
              </View>

              {resultData.musicRecommendations.map((song: any, index: number) => (
                <View key={song.id} style={styles.musicCard}>
                  <Image source={{ uri: song.thumbnail }} style={styles.musicImage} />

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.musicTitle}>{song.title}</Text>
                    <Text style={styles.musicArtist}>{song.artist}</Text>
                  </View>

                  <TouchableOpacity style={styles.musicPlayButton}>
                    <Play size={18} color="#8A2BE2" fill="#8A2BE2" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => router.push("/DreamHistoryScreen")}
              style={styles.buttonPrimary}
            >
              <Text style={styles.buttonPrimaryText}>과거 꿈 기록 보기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F3FF" },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerCenter: { alignItems: "center" },
  headerTitle: { color: "#fff", fontSize: 32, fontWeight: "700", marginTop: 16 },
  headerSubtitle: {
    color: "#EDE9FE",
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  section: { paddingHorizontal: 24, paddingVertical: 24 },
  block: { marginBottom: 20 },
  inputTitle: { color: "#4C1D95", fontSize: 24, fontWeight: "700" },
  inputSubtitle: { color: "#6B21A8", fontSize: 16 },

  inputCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 2,
  },
  inputField: {
    color: "#4C1D95",
    fontSize: 16,
    height: 150,
  },

  buttonPrimary: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#6D28D9",
  },
  buttonPrimaryText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#F5F3FF",
  },
  loadingBox: {
    width: "100%",
    maxWidth: 340,
    padding: 32,
    borderRadius: 28,
    alignItems: "center",
  },
  loadingTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  loadingSubtitle: {
    color: "#EDE9FE",
    textAlign: "center",
    marginBottom: 20,
  },
  dots: { flexDirection: "row", marginTop: 10 },
  dot: { width: 10, height: 10, marginHorizontal: 5, backgroundColor: "white", borderRadius: 5 },

  cancelButton: {
    marginTop: 20,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#C4B5FD",
  },
  cancelButtonText: { color: "#6D28D9", fontWeight: "600" },
  resultsHeader: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  resultsHeaderRow: { flexDirection: "row", justifyContent: "space-between" },
  resultsHeaderText: { color: "#fff", fontSize: 28, fontWeight: "700" },
  restartButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 2,
  },
  cardTitle: { marginLeft: 8, color: "#4C1D95", fontSize: 20, fontWeight: "700" },
  cardText: { color: "#374151", marginTop: 4, lineHeight: 22 },
  rowCenter: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  emotionCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  emotionCardTitle: { marginLeft: 8, color: "#fff", fontSize: 20, fontWeight: "700" },
  emotionMainRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  emotionPrimary: { color: "#fff", fontSize: 26, fontWeight: "800" },
  emotionSecondary: { color: "#EDE9FE", fontSize: 18, marginLeft: 8 },
  emotionDesc: { color: "#fff", lineHeight: 22 },
  musicCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: "center",
    elevation: 2,
  },
  musicImage: { width: 60, height: 60, borderRadius: 12 },
  musicTitle: { color: "#4C1D95", fontSize: 18, fontWeight: "700" },
  musicArtist: { color: "#6B21A8" },
  musicPlayButton: {
    backgroundColor: "#EDE9FE",
    padding: 10,
    borderRadius: 30,
  },

  historyCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 18,
    flexDirection: "row",
    marginBottom: 10,
    elevation: 2,
  },
  historyImage: { width: 64, height: 64, borderRadius: 12 },
  historyHeaderRow: { flexDirection: "row", justifyContent: "space-between" },
  historyTitle: { color: "#4C1D95", fontWeight: "700", flex: 1 },
  historyDateRow: { flexDirection: "row", alignItems: "center" },
  historyDate: { color: "#6B21A8", marginLeft: 4, fontSize: 10 },
  historySnippet: { color: "#6B7280", marginTop: 4, fontSize: 12 },
  historyEmotionRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  historyEmotion: { color: "#6B21A8", marginLeft: 4, fontSize: 12 },
});
