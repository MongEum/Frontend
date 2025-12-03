import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Animated, Easing } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Play, Heart, Brain, Moon, Sparkles, Calendar } from "lucide-react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const mockDreams = [
  {
    id: "1",
    date: "2023-05-15",
    title: "하늘을 나는 꿈",
    snippet: "푸른 하늘을 날아다니며 자유로움을 느꼈다...",
    emotion: "Joyful",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900",
  },
  {
    id: "2",
    date: "2023-05-10",
    title: "물고기와 대화하는 꿈",
    snippet: "바다에서 물고기들과 대화를 나누며...",
    emotion: "Curious",
    image:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=900",
  },
  {
    id: "3",
    date: "2023-05-05",
    title: "잃어버린 열쇠",
    snippet: "중요한 문을 여는 열쇠를 찾아 헤맸다...",
    emotion: "Anxious",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900",
  },
];

export default function DreamInterpretationScreen() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<"input" | "loading" | "results">("input");
  const [dreamInput, setDreamInput] = useState("");

  const dreamInterpretation =
    "Flying in dreams often represents a desire for freedom or breaking away from limitations...";
  const emotionAnalysis = {
    primary: "Peaceful",
    secondary: "Hopeful",
    description: "Your dream reflects inner tranquility and optimism.",
  };

  const recommendedMusic = [
    {
      id: 1,
      title: "Stellar Dreams",
      artist: "Luna Echo",
      thumbnail:
        "https://images.unsplash.com/photo-1612232134966-a9b076b9fbe7?w=900",
    },
    {
      id: 2,
      title: "Midnight Whispers",
      artist: "Celestial Waves",
      thumbnail:
        "https://images.unsplash.com/photo-1584300790099-721339c5116a?w=900",
    },
    {
      id: 3,
      title: "Ethereal Journey",
      artist: "Dreamscape Collective",
      thumbnail:
        "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=900",
    },
  ];

  const handleInterpretDream = () => {
    if (!dreamInput.trim()) return;
    setCurrentView("loading");
    setTimeout(() => setCurrentView("results"), 2500);
  };

  const resetToInput = () => {
    setDreamInput("");
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
      {/* -------------------- Input View -------------------- */}
      {currentView === "input" && (
        <ScrollView>

          {/* Header */}
          <LinearGradient colors={["#8A2BE2", "#9370DB"]} style={styles.header}>
            <View style={styles.headerCenter}>
              <Moon size={48} color="#fff" strokeWidth={1.5} />
              <Text style={styles.headerTitle}>DreamScape AI</Text>
              <Text style={styles.headerSubtitle}>
                Discover the hidden meanings behind your dreams
              </Text>
            </View>
          </LinearGradient>

          {/* Input Section */}
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

      {/* -------------------- Loading View -------------------- */}
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

      {/* -------------------- Results View -------------------- */}
      {currentView === "results" && (
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

            {/* Interpretation Card */}
            <View style={styles.card}>
              <View style={styles.rowCenter}>
                <Brain size={24} color="#8A2BE2" />
                <Text style={styles.cardTitle}>꿈 해석</Text>
              </View>
              <Text style={styles.cardText}>{dreamInterpretation}</Text>
            </View>

            {/* Emotion Card */}
            <LinearGradient colors={["#A78BFA", "#6366F1"]} style={styles.emotionCard}>
              <View style={styles.rowCenter}>
                <Heart size={24} color="#fff" />
                <Text style={styles.emotionCardTitle}>감정 분석</Text>
              </View>

              <View style={styles.emotionMainRow}>
                <Text style={styles.emotionPrimary}>{emotionAnalysis.primary}</Text>
                <Text style={styles.emotionSecondary}>• {emotionAnalysis.secondary}</Text>
              </View>

              <Text style={styles.emotionDesc}>{emotionAnalysis.description}</Text>
            </LinearGradient>

            {/* Music */}
            <View style={{ marginBottom: 20 }}>
              <View style={styles.rowCenter}>
                <Play size={24} color="#8A2BE2" />
                <Text style={styles.cardTitle}>음악 추천</Text>
              </View>

              {recommendedMusic.map((song) => (
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

/* -------------------- Styles -------------------- */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F3FF" },

  /* Input header */
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

  /* Input section */
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

  /* Loading */
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

  /* Results */
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

  /* Cards */
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

  /* Emotion */
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

  /* Music */
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

  /* History Items */
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
