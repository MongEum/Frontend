import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
const API_BASE_URL = 'http://192.168.219.138:8080';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const canLogin = email && password && !isLoading;

  const handleLogin = async () => {
    if (!canLogin) return;

    setErrorMessage('');
    setIsLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        const data = await response.json();

        if (response.status === 200) {
            const token = data.data?.accessToken;
            if (token) {
                await AsyncStorage.setItem('userToken', token); // 'userToken'이라는 이름으로 저장
                console.log("토큰 저장 완료:", token);
            } else {
                console.warn("로그인은 성공했으나 토큰이 없습니다. 백엔드 응답을 확인하세요.");
            }
            Alert.alert("로그인 성공", data.message || "환영합니다!");

            router.push('/DreamInterpretationScreen');        
        } else if (response.status === 401) {
            setErrorMessage(data.message || "이메일 또는 비밀번호가 일치하지 않습니다.");         
        } else if (response.status === 400) {
            const validationMessage = data.message || "입력 형식이 올바르지 않습니다.";
            setErrorMessage(`입력 오류: ${validationMessage}`);
        } else {
            setErrorMessage(data.message || `알 수 없는 서버 오류가 발생했습니다. 상태 코드: ${response.status}`);
        }

    } catch (error) {
        console.error('로그인 API 호출 오류:', error);
        setErrorMessage("네트워크 연결 오류. 서버 주소를 확인해주세요.");
    } finally {
        setIsLoading(false);
    }
  };
  const handleSignUpRedirect = () => {
    router.push('/SignUpScreen');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.fullScreen} 
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1636337897543-83b55150608f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8JTIyQ2luZW1hJTIwbW92aWUlMjBuaWdodCUyMGV4cGVyaWVuY2V8ZW58MHx8MHx8fDA%3D' }}
          style={styles.backgroundImage}
        >
          <View style={styles.overlay}>
            <View style={styles.contentContainer}>
              <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>환영합니다</Text>
                <Text style={styles.headerSubtitle}>계정에 로그인하여 계속하세요</Text>
              </View>

              <View style={styles.formCard}>
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>이메일</Text>
                  <View style={styles.inputWrapper}>
                    <Mail size={20} color={styles.iconColor.color} />
                    <TextInput
                      style={styles.input}
                      placeholder="이메일 주소를 입력하세요"
                      placeholderTextColor="#B19CD9"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                </View>

                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>비밀번호</Text>
                  <View style={styles.inputWrapper}>
                    <Lock size={20} color={styles.iconColor.color} />
                    <TextInput
                      style={styles.input}
                      placeholder="비밀번호를 입력하세요"
                      placeholderTextColor="#B19CD9"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <EyeOff size={20} color={styles.iconColor.color} />
                      ) : (
                        <Eye size={20} color={styles.iconColor.color} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.optionsContainer}>
                  <TouchableOpacity 
                    style={styles.rememberMe}
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    <View style={[styles.checkboxBase, rememberMe && styles.checkboxActive]} />
                    <Text style={styles.rememberMeText}>로그인 유지</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity>
                    <Text style={styles.forgotPasswordText}>비밀번호 찾기</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[
                    styles.loginButtonBase,
                    canLogin ? styles.loginButtonActive : styles.loginButtonDisabled
                  ]}
                  onPress={handleLogin}
                  disabled={!canLogin}
                >
                  <Text style={styles.buttonText}>로그인</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.redirectContainer}>
                <Text style={styles.redirectText}>계정이 없으신가요? </Text>
                <TouchableOpacity onPress={handleSignUpRedirect}>
                  <Text style={styles.redirectLink}>회원가입</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(90, 24, 154, 0.7)', 
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32, 
  },
  headerContainer: {
    marginBottom: 48, 
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 32, 
    fontWeight: 'bold',
    marginBottom: 8, 
  },
  headerSubtitle: {
    color: '#DDD6FE', 
    fontSize: 18, 
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: 24, 
    padding: 24, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  fieldContainer: {
    marginBottom: 24, 
  },
  label: {
    color: '#4C1D95',
    fontWeight: '500', 
    marginBottom: 8, 
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF', 
    borderRadius: 12, 
    paddingHorizontal: 16, 
  },
  input: {
    flex: 1,
    paddingVertical: 16, 
    paddingHorizontal: 12, 
    color: '#4C1D95', 
    fontSize: 16,
  },
  iconColor: {
    color: '#8A2BE2', 
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32, 
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBase: {
    width: 20, 
    height: 20, 
    borderRadius: 4, 
    borderWidth: 1, 
    marginRight: 8, 
    borderColor: '#C4B5FD',
  },
  checkboxActive: {
    backgroundColor: '#8B5CF6', 
    borderColor: '#8B5CF6', 
  },
  rememberMeText: {
    color: '#8A2BE2', 
  },
  forgotPasswordText: {
    color: '#A78BFA', 
    fontWeight: '500', 
  },
  loginButtonBase: {
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonActive: {
    backgroundColor: '#7C3AED', 
  },
  loginButtonDisabled: {
    backgroundColor: '#C4B5FD', 
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18, 
    fontWeight: 'bold',
  },
  redirectContainer: {
    marginTop: 32, 
    flexDirection: 'row',
    justifyContent: 'center',
  },
  redirectText: {
    color: '#DDD6FE', 
  },
  redirectLink: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  }
});
