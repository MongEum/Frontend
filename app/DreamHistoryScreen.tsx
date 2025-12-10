import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import {
  Brain,
  Calendar,
  Heart,
  Plus,
  Search,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const API_BASE_URL = 'http://localhost:8080/api';
const getYouTubeThumbnail = (url: string) => {
  if (!url) return "https://via.placeholder.com/150";
  try {
    // youtu.be 단축 URL 등 다양한 케이스 대비 로직 보완
    let videoId = "";
    if (url.includes("v=")) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    }
    
    return videoId 
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` 
      : "https://via.placeholder.com/150";
  } catch (e) {
    return "https://via.placeholder.com/150";
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return dateString.split('T')[0];
};

export default function DreamHistoryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [dreams, setDreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchDreams = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert("알림", "로그인이 필요합니다.");
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/api/dreams`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("꿈 목록 로드 성공:", response.data.data.length, "개");

      const mappedDreams = response.data.data.map((item: any) => ({
        id: item.id.toString(), 
        date: formatDate(item.createdAt),
        title: item.title,
        snippet: item.content, 
        emotion: item.emotionCategory, 
        image: getYouTubeThumbnail(item.recommendedSongUrl)
      }));
      setDreams(mappedDreams.reverse()); 

    } catch (error) {
      console.error(" 목록 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchDreams();
    }, [])
  );
  const filteredDreams = dreams.filter((dream) => {
    const matchesSearch =
      dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dream.snippet.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter =
      selectedFilter === "all" ||
      dream.emotion.toLowerCase() === selectedFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const handlePressDream = (id: string) => {
    router.push({
      pathname: "/DreamDetailScreen",
      params: { id: id }
    });
  };

  const renderDreamItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />

      <View style={styles.cardContent}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.dateRow}>
            <Calendar size={14} color="#8A2BE2" />
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        </View>

        <Text style={styles.cardSnippet} numberOfLines={2}>
          {item.snippet}
        </Text>

        <View style={styles.cardFooterRow}>
          <Heart size={14} color="#8A2BE2" fill="#8A2BE2" />
          <Text style={styles.emotion}>{item.emotion}</Text>

          <Brain size={14} color="#8A2BE2" style={{ marginLeft: 10 }} />
          <Text style={styles.analysisText}>Dream Analysis</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={["#8B5CF6", "#6366F1"]}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()} 
          >
            <Text style={styles.headerButtonText}>뒤로</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>꿈 기록</Text>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push("/DreamInterpretationScreen")}
          >
            <Plus size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Search size={20} color="#8A2BE2" />
          <TextInput
            style={styles.searchInput}
            placeholder="꿈을 검색하세요..."
            placeholderTextColor="#B19CD9"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterRow}>
          {[
            { key: "all", label: "전체" },
            { key: "peaceful", label: "평온" }, 
            { key: "anxious", label: "불안" },
            { key: "joyful", label: "기쁨" },
          ].map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              onPress={() => setSelectedFilter(key)}
              style={[
                styles.filterButton,
                selectedFilter === key && styles.filterButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === key && styles.filterButtonTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.listWrapper}>
        {loading ? (
           <View style={styles.emptyContainer}>
             <ActivityIndicator size="large" color="#8B5CF6" />
           </View>
        ) : filteredDreams.length > 0 ? (
          <FlatList
            data={filteredDreams}
            renderItem={renderDreamItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Brain size={64} color="#C4B5FD" />
            <Text style={styles.emptyText}>저장된 꿈이 없습니다</Text>
            <Text style={styles.emptySubText}>
              "+" 버튼을 눌러 새로운 꿈을 기록하세요
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F3FF",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 999,
  },
  headerButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 26,
    fontWeight: "700",
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    marginTop: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: "#4C1D95",
    fontSize: 16,
  },
  filterRow: {
    flexDirection: "row",
    marginTop: 14,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: "#FFF",
  },
  filterButtonText: {
    color: "#FFF",
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "#6D28D9",
  },
  listWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
    elevation: 2,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  cardContent: {
    flex: 1,
    marginLeft: 14,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    color: "#4C1D95",
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    marginLeft: 4,
    color: "#6D28D9",
  },
  cardSnippet: {
    marginTop: 6,
    color: "#4B5563",
    fontSize: 14,
  },
  cardFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  emotion: {
    marginLeft: 4,
    marginRight: 10,
    color: "#6D28D9",
    fontSize: 13,
  },
  analysisText: {
    marginLeft: 4,
    color: "#6D28D9",
    fontSize: 13,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: {
    marginTop: 16,
    color: "#6D28D9",
    fontSize: 20,
    fontWeight: "600",
  },
  emptySubText: {
    marginTop: 6,
    textAlign: "center",
    color: "#8B5CF6",
  },
});
