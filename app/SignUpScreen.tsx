import { useRouter } from 'expo-router';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { height } = Dimensions.get('window');
const API_BASE_URL = 'http://192.168.219.138:8080';

export default function SignUpScreen() {
  const router = useRouter();
  const [nickname, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false); 
  const [errorMessage, setErrorMessage] = useState('');

  const canSignUp = nickname && email && password && confirmPassword && password === confirmPassword && !isLoading;
  
  const handleSignUp = async () => {
      console.log("canSignUp 상태:", canSignUp); // 이 값이 false로 나오는지 확인
      if (!canSignUp) {
          console.log("회원가입 버튼 비활성화: 조건을 충족하지 않음.");
          return; 
      }
      setErrorMessage('');
      setIsLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nickname: nickname,
            email: email,
            password: password,
          }),
        });

        //const data = await response.json();
const text = await response.text();
        
        // 2. 로그창에 서버 응답을 출력합니다. (여기서 "Not Found" 등이 뜨는지 확인)
        console.log("🔥 서버 응답 상태코드:", response.status);
        console.log("🔥 서버 응답 본문(text):", text);

        // 3. 텍스트를 JSON으로 변환합니다.
        const data = JSON.parse(text);
        if (response.status === 201) {
          Alert.alert("회원가입 성공", data.message || "계정이 성공적으로 생성되었습니다.");
          router.push('/LoginScreen');
          
        } else if (response.status === 409) {
          setErrorMessage(data.message || "이미 존재하는 이메일입니다.");
          
        } else if (response.status === 400) {
          const validationMessage = data.message || "유효성 검사에 실패했습니다.";
          setErrorMessage(`입력 오류: ${validationMessage}`);
          
        } else {
          setErrorMessage(data.message || `알 수 없는 오류가 발생했습니다. 상태 코드: ${response.status}`);
        }

      } catch (error) {
        console.error('회원가입 API 호출 오류:', error);
        setErrorMessage("네트워크 오류 또는 서버에 연결할 수 없습니다.");
      } finally {
        setIsLoading(false);
      }
    };
  const handleLoginRedirect = () => {
    router.push('/LoginScreen');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.fullScreen} // flex-1
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.fullScreen}>
          <View style={styles.contentWrapper}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>회원가입</Text>
              <Text style={styles.headerSubtitle}>계정을 생성하여 시작하세요</Text>
            </View>

            <View style={styles.formCard}>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>닉네임</Text>
                <View style={styles.inputWrapper}>
                  <User size={20} color={styles.iconColor.color} />
                  <TextInput
                    style={styles.input}
                    placeholder="이름을 입력하세요"
                    placeholderTextColor="#B19CD9" 
                    value={nickname}
                    onChangeText={setName}
                    autoCapitalize="none"
                    maxLength={10}
                  />
                </View>
              </View>

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
                    maxLength={64}
                  />
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>비밀번호</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={20} color={styles.iconColor.color} />
                  <TextInput
                    style={styles.input}
                    placeholder="비밀번호를 입력하세요 (최소 6자)"
                    placeholderTextColor="#B19CD9"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color={styles.iconColor.color} />
                    ) : (
                      <Eye size={20} color={styles.iconColor.color} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>비밀번호 확인</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={20} color={styles.iconColor.color} />
                  <TextInput
                    style={styles.input}
                    placeholder="비밀번호를 다시 입력하세요"
                    placeholderTextColor="#B19CD9"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.passwordToggle}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color={styles.iconColor.color} />
                    ) : (
                      <Eye size={20} color={styles.iconColor.color} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.termsContainer}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#C4B5FD', marginRight: 8 }} />
                  <Text style={styles.termsText}>
                    <Text style={{ fontWeight: 'bold' }}>서비스 약관</Text> 및 <Text style={{ fontWeight: 'bold' }}>개인정보 보호정책</Text>에 동의합니다
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.signUpButtonBase,
                  canSignUp ? styles.signUpButtonActive : styles.signUpButtonDisabled
                ]}
                onPress={handleSignUp}
                disabled={!canSignUp}
              >
                <Text style={styles.buttonText}>회원가입</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.redirectContainer}>
              <Text style={styles.redirectText}>이미 계정이 있으신가요? </Text>
              <TouchableOpacity onPress={handleLoginRedirect}>
                <Text style={styles.redirectLink}>로그인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#5A189A', 
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32, 
    backgroundColor: 'rgba(90, 24, 154, 0.7)', 
  },
  headerContainer: {
    marginBottom: 32, 
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
    marginBottom: 16, 
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
  passwordToggle: {
    padding: 4,
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    color: '#8A2BE2',
    fontSize: 12, 
  },
  signUpButtonBase: {
    paddingVertical: 16,
    borderRadius: 12, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpButtonActive: {
    backgroundColor: '#7C3AED',
  },
  signUpButtonDisabled: {
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