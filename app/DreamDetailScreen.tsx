import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Brain,
  Calendar,
  ChevronLeft,
  Heart,
  Play,
  Share2,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const API_BASE_URL = 'http://192.168.219.138:8080';
const { width } = Dimensions.get("window");

// Mock data
const mockDreamDetail = {
  id: "1",
  date: "2023-05-15",
  title: "하늘을 나는 꿈",
  content:
    "푸른 하늘을 날아다니며 자유로움을 느꼈다. 바람이 몸을 스치는 감촉이 매우 상쾌했고, 구름 사이를 지나가며 멀리 아래를 내려다보았다. 엄청난 높이에서 세상을 조감도처럼 바라보니 평소 내가 신경 쓰던 일들이 얼마나 작게 느껴지는지 깨달았다. 이 꿈은 매우 밝고 긍정적인 감정을 동반했다.",
  interpretation:
    "하늘을 나는 꿈은 일반적으로 자유를 갈망하거나 현재 상황에서 벗어나고 싶은 욕망을 상징합니다...",
  emotion: {
    primary: "Peaceful",
    secondary: "Empowered",
    description:
      "당신의 꿈은 내면의 평온과 자신감을 반영합니다...",
  },
  musicRecommendations: [
    {
      id: 1,
      title: "Skyward Journey",
      artist: "Celestial Sounds",
      thumbnail:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900",
    },
    {
      id: 2,
      title: "Freedom Winds",
      artist: "Nature Harmony",
      thumbnail:
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=900",
    },
    {
      id: 3,
      title: "Above the Clouds",
      artist: "Dreamscape Orchestra",
      thumbnail:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900",
    },
  ],
};

export default function DreamDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [dream, setDream] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDreamDetail = async () => {
    try {
      // 저장된 JWT 토큰 가져오기 (구현 방식에 따라 다름)
      const token = await AsyncStorage.getItem('userToken');

      // GET /api/dreams/{id} 호출
      const response = await axios.get(`https://your-api-url.com/api/dreams/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // JWT 토큰 헤더 포함
        }
      });

      setDream(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("오류", "꿈 정보를 불러오는데 실패했습니다.");
      router.back(); // 실패 시 뒤로가기
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
    if (id) {
      fetchDreamDetail();
    }
  }, [id]);

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  // 데이터가 없을 때 (혹은 에러)
  if (!dream) return null;
  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>

        {/* Header */}
        <LinearGradient
          colors={["#8B5CF6", "#4F46E5"]}
          style={styles.header}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={24} color="#fff" />
            <Text style={styles.backText}>뒤로</Text>
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>{mockDreamDetail.title}</Text>
              <View style={styles.headerDateRow}>
                <Calendar size={16} color="#fff" />
                <Text style={styles.headerDate}>{mockDreamDetail.date}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.shareButton}>
              <Share2 size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Body */}
        <View style={styles.body}>

          {/* Dream Image */}
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: mockDreamDetail.musicRecommendations[0].thumbnail }}
              style={styles.mainImage}
            />
          </View>

          {/* Dream Content */}
          <View style={styles.card}>
            <View style={styles.iconTitleRow}>
              <Brain size={20} color="#8A2BE2" />
              <Text style={styles.cardTitle}>꿈 내용</Text>
            </View>
            <Text style={styles.cardText}>{mockDreamDetail.content}</Text>
          </View>

          {/* Interpretation */}
          <View style={styles.card}>
            <View style={styles.iconTitleRow}>
              <Brain size={20} color="#8A2BE2" />
              <Text style={styles.cardTitle}>해석 결과</Text>
            </View>
            <Text style={styles.cardText}>{mockDreamDetail.interpretation}</Text>
          </View>

          {/* Emotion */}
          <LinearGradient
            colors={["#A78BFA", "#6366F1"]}
            style={styles.emotionCard}
          >
            <View style={styles.iconTitleRow}>
              <Heart size={20} color="#fff" />
              <Text style={styles.emotionTitle}>감정 분석</Text>
            </View>

            <View style={styles.emotionPrimaryRow}>
              <Text style={styles.emotionPrimary}>{mockDreamDetail.emotion.primary}</Text>
              <Text style={styles.emotionSecondary}>• {mockDreamDetail.emotion.secondary}</Text>
            </View>

            <Text style={styles.emotionDesc}>
              {mockDreamDetail.emotion.description}
            </Text>
          </LinearGradient>

          {/* Music List */}
          <View style={{ marginBottom: 20 }}>
            <View style={styles.iconTitleRow}>
              <Play size={20} color="#8A2BE2" />
              <Text style={styles.cardTitle}>추천 음악</Text>
            </View>

            {mockDreamDetail.musicRecommendations.map((song) => (
              <View key={song.id} style={styles.musicCard}>
                <Image source={{ uri: song.thumbnail }} style={styles.musicImage} />
                <View style={styles.musicInfo}>
                  <Text style={styles.musicTitle}>{song.title}</Text>
                  <Text style={styles.musicArtist}>{song.artist}</Text>
                </View>
                <TouchableOpacity style={styles.musicPlayButton}>
                  <Play size={16} color="#8A2BE2" fill="#8A2BE2" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F3FF" },

  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  backText: { color: "#fff", fontSize: 16, marginLeft: 6 },
  headerContent: { flexDirection: "row", justifyContent: "space-between" },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  headerDateRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  headerDate: { color: "#EDE9FE", marginLeft: 4 },

  body: { paddingHorizontal: 24, paddingVertical: 24 },

  imageWrapper: { marginBottom: 24, borderRadius: 16, overflow: "hidden" },
  mainImage: { width: width - 48, height: 200, borderRadius: 16 },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  iconTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  cardTitle: { marginLeft: 8, color: "#4C1D95", fontSize: 18, fontWeight: "600" },
  cardText: { color: "#374151", lineHeight: 22 },

  emotionCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  emotionTitle: { marginLeft: 8, color: "#fff", fontSize: 18, fontWeight: "600" },
  emotionPrimaryRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  emotionPrimary: { color: "#fff", fontSize: 22, fontWeight: "700" },
  emotionSecondary: { color: "#EDE9FE", fontSize: 18, marginLeft: 6 },
  emotionDesc: { color: "#fff", lineHeight: 22 },

  musicCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  shareButton: { },
  musicImage: { width: 60, height: 60, borderRadius: 12 },
  musicInfo: { flex: 1, marginLeft: 16 },
  musicTitle: { fontWeight: "bold", fontSize: 16, color: "#4C1D95" },
  musicArtist: { color: "#6D28D9" },
  musicPlayButton: {
    backgroundColor: "#EDE9FE",
    padding: 10,
    borderRadius: 30,
  },
});
