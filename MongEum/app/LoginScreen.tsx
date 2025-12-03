import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ImageBackground, 
  KeyboardAvoidingView, 
  Platform,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';

// Tailwind 색상 및 값 기반 스타일 정의
const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(90, 24, 154, 0.7)', // purple-900 with opacity 70%
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32, // px-8
  },
  // Header
  headerContainer: {
    marginBottom: 48, // mb-12
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 32, // text-4xl
    fontWeight: 'bold',
    marginBottom: 8, // mb-2
  },
  headerSubtitle: {
    color: '#DDD6FE', // purple-200
    fontSize: 18, // text-lg
  },
  // Form Card
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // white with opacity 90%
    borderRadius: 24, // rounded-3xl
    padding: 24, // p-6
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  fieldContainer: {
    marginBottom: 24, // mb-6
  },
  label: {
    color: '#4C1D95', // purple-900
    fontWeight: '500', // font-medium
    marginBottom: 8, // mb-2
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF', // purple-50
    borderRadius: 12, // rounded-xl
    paddingHorizontal: 16, // px-4
  },
  input: {
    flex: 1,
    paddingVertical: 16, // py-4
    paddingHorizontal: 12, // px-3
    color: '#4C1D95', // text-purple-900
    fontSize: 16,
  },
  iconColor: {
    color: '#8A2BE2', // #8A2BE2
  },
  // Options (Remember Me & Forgot Password)
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32, // mb-8
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBase: {
    width: 20, // w-5
    height: 20, // h-5
    borderRadius: 4, // rounded
    borderWidth: 1, // border
    marginRight: 8, // mr-2
    borderColor: '#C4B5FD', // border-purple-300
  },
  checkboxActive: {
    backgroundColor: '#8B5CF6', // bg-purple-500
    borderColor: '#8B5CF6', // border-purple-500
  },
  rememberMeText: {
    color: '#8A2BE2', // text-purple-700
  },
  forgotPasswordText: {
    color: '#A78BFA', // text-purple-500
    fontWeight: '500', // font-medium
  },
  // Login Button
  loginButtonBase: {
    paddingVertical: 16, // py-4
    borderRadius: 12, // rounded-xl
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonActive: {
    backgroundColor: '#7C3AED', // bg-purple-600
  },
  loginButtonDisabled: {
    backgroundColor: '#C4B5FD', // bg-purple-300
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18, // text-lg
    fontWeight: 'bold',
  },
  // Sign Up Redirect
  redirectContainer: {
    marginTop: 32, // mt-8
    flexDirection: 'row',
    justifyContent: 'center',
  },
  redirectText: {
    color: '#DDD6FE', // purple-200
  },
  redirectLink: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  }
});


export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // 로그인 성공 시 (tabs) 그룹의 첫 화면으로 이동합니다.
  const handleLogin = () => {
    // '/(tabs)' 경로로 이동하면, _layout.tsx에 설정된 탭 네비게이터의 첫 화면(DreamInputScreen)으로 연결됩니다.
    router.push('/DreamInterpretationScreen');
  };

  // 회원가입 화면으로 이동합니다.
  const handleSignUpRedirect = () => {
    router.push('/SignUpScreen');
  };

  const canLogin = email && password;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.fullScreen} // flex-1
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1636337897543-83b55150608f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8JTIyQ2luZW1hJTIwbW92aWUlMjBuaWdodCUyMGV4cGVyaWVuY2V8ZW58MHx8MHx8fDA%3D' }}
          style={styles.backgroundImage} // flex-1
        >
          <View style={styles.overlay}>
            <View style={styles.contentContainer}>
              {/* Header */}
              <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>환영합니다</Text>
                <Text style={styles.headerSubtitle}>계정에 로그인하여 계속하세요</Text>
              </View>

              {/* Login Form */}
              <View style={styles.formCard}>
                {/* Email Field */}
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

                {/* Password Field */}
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

                {/* Remember Me & Forgot Password */}
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

                {/* Login Button */}
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

              {/* Sign Up Redirect */}
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