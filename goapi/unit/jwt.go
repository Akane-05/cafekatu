package unit

import (
	"errors"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

type JwtInfo struct {
	Id     int
	Email  string
	ExTime time.Time
}

// トークンを作成
func CreateToken(jwtInfo *JwtInfo) (tokenString string) {
	//以下jwt認証
	claims := jwt.MapClaims{
		"id":    jwtInfo.Id,
		"email": jwtInfo.Email,
		"exp":   jwtInfo.ExTime.Unix(),
	}
	log.Printf("claims: %#v\n", claims)

	// ヘッダーとペイロードの生成
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	log.Printf("Header: %#v\n", token.Header)
	log.Printf("Claims: %#v\n", token.Claims)

	// トークンに署名を付与
	secret := os.Getenv("SECRET_KEY")
	tokenString, _ = token.SignedString([]byte(secret))

	return
}

// Parse は jwt トークンから元になった認証情報を取り出す。
func CheckJwtToken(c *gin.Context) {

	jwtToken, err := ExtractBearerToken(c.GetHeader("Authorization"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	token, err := ParseToken(jwtToken)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	_, OK := token.Claims.(jwt.MapClaims)
	if !OK {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

}

// Parse は jwt トークンから元になった認証情報を取り出す。
func GetJwtToken(c *gin.Context) (JwtInfo, error) {
	var jwtInfo JwtInfo

	jwtToken, _ := ExtractBearerToken(c.GetHeader("Authorization"))
	token, _ := ParseToken(jwtToken)

	claims, _ := token.Claims.(jwt.MapClaims)

	email, OK := claims["email"].(string)
	if !OK {
		return jwtInfo, errors.New("トークンの取得に失敗しました。 email")
	}

	idF, OK := claims["id"].(float64)
	log.Println(idF)
	if !OK {
		return jwtInfo, errors.New("トークンの取得に失敗しました。 id")
	}

	id := int(idF)
	jwtInfo = JwtInfo{Id: id, Email: email}

	return jwtInfo, nil

}

func ExtractBearerToken(header string) (string, error) {
	if header == "" {
		return "", errors.New("bad header value given")
	}

	jwtToken := header
	return jwtToken, nil
}

func ParseToken(jwtToken string) (*jwt.Token, error) {
	secret := os.Getenv("SECRET_KEY")

	// jwtの検証
	token, err := jwt.Parse(jwtToken, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil // CreateTokenにて指定した文字列を使います
	})
	if err != nil {
		return token, err
	}

	return token, nil
}
