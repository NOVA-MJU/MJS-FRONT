import { createContext, useContext, useEffect, useState } from 'react'
import { postLogin, postLogout, postReissueAccessToken, postSignup } from '../api/authApi'
import { useCookies } from 'react-cookie'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null) // 로그인한 사용자 정보 저장
  const [accessToken, setAccessToken] = useState(null) //빠른 접근을 위해 일단 메모리 (상태에다가 저장한다)
  const [cookies, setCookies, removeCookies] = useCookies(['accessToken', 'refreshToken'])

  // 새로고침 시 로그인흔적을 파악하는 부분임 -> cookies
  useEffect(() => {
    const storedToken = cookies.accessToken
    setAccessToken(storedToken)
    if (storedToken) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [])

  const signup = async (userData) => {
    try {
      await postSignup(userData)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // 글로벌 로그인 함수
  // authContext에서 loginApi(login in authApi.jsx)함수를 빌려쓴 글로벌 로그인함수 창조 -> 얘로 실제 로그인 통신함
  // 새로고침시 로그인 흔적 사라지는거 방지 (보안 상 http 쿠키랑 쓰는게 좋긴한데) 일단 session storage에 저장한다.
  const login = async (userInfo) => {
    try {
      const data = await postLogin(userInfo) //결과물로 data.accessToken과 data.refreshToken을 줄거야.
      setAccessToken(data.accessToken)
      setIsLoggedIn(true)

      setCookies('accessToken', data.accessToken)
      setCookies('refreshToken', data.refreshToken)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  // 글로벌 로그아웃 함수
  const logout = async () => {
    try {
      await postLogout(accessToken)
    } catch (e) {
      console.error('error AuthContext.jsx', e)
    } finally {
      removeCookies('accessToken')
      removeCookies('refreshToken')

      setAccessToken(null)
      setUser(null)
      setIsLoggedIn(false)
    }
  }

  const reissusToken = async () => {
    const refreshToken = cookies.refreshToken

    if (!refreshToken) {
      console.error('error AuthContext.jsx refreshToken이 없음')
      logout()
    }

    try {
      const response = await postReissueAccessToken(refreshToken)
    } catch (e) {
      console.error(e)

    }
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
