import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  StyleSheet,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react-native';

const { height } = Dimensions.get('window');

// Tailwind 색상 및 값 기반 스타일 정의
const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#5A189A', // purple-900
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32, // px-8
    backgroundColor: 'rgba(90, 24, 154, 0.7)', // purple-900 with opacity 70%
  },
  headerContainer: {
    marginBottom: 32, // mb-8
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
    marginBottom: 16, // mb-4
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
    color: '#8A2BE2',
  },
  passwordToggle: {
    padding: 4,
  },
  // Terms and Conditions
  termsContainer: {
    marginBottom: 24, // mb-6
  },
  termsText: {
    color: '#8A2BE2', // purple-700
    fontSize: 12, // text-sm
  },
  // Sign Up Button
  signUpButtonBase: {
    paddingVertical: 16, // py-4
    borderRadius: 12, // rounded-xl
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpButtonActive: {
    backgroundColor: '#7C3AED', // bg-purple-600
  },
  signUpButtonDisabled: {
    backgroundColor: '#C4B5FD', // bg-purple-300
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18, // text-lg
    fontWeight: 'bold',
  },
  // Login Redirect
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


export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const canSignUp = name && email && password && confirmPassword && password === confirmPassword;

  const handleSignUp = () => {
    // In a real app, this would connect to an authentication service
    // For now, we'll just navigate to the tabs group containing DreamHistoryScreen
    router.push('/LoginScreen');
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
              {/* Header */}
              <Text style={styles.headerTitle}>회원가입</Text>
              <Text style={styles.headerSubtitle}>계정을 생성하여 시작하세요</Text>
            </View>

            {/* Sign Up Form */}
            <View style={styles.formCard}>
              
              {/* Name Field */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>이름</Text>
                <View style={styles.inputWrapper}>
                  <User size={20} color={styles.iconColor.color} />
                  <TextInput
                    style={styles.input}
                    placeholder="이름을 입력하세요"
                    placeholderTextColor="#B19CD9" // purple-300
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>

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

              {/* Confirm Password Field */}
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

              {/* Terms and Conditions */}
              <View style={styles.termsContainer}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#C4B5FD', marginRight: 8 }} />
                  <Text style={styles.termsText}>
                    <Text style={{ fontWeight: 'bold' }}>서비스 약관</Text> 및 <Text style={{ fontWeight: 'bold' }}>개인정보 보호정책</Text>에 동의합니다
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Sign Up Button */}
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

            {/* Login Redirect */}
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