.PHONY: server server-clean build clean

# デフォルトのターゲット
all: server

# ローカルサーバーの起動（下書きも含めて表示）
server:
	hugo server -D

# キャッシュをクリアしてローカルサーバーを起動（表示がおかしい場合などに使用）
server-clean:
	hugo server -D --disableFastRender --ignoreCache --noHTTPCache

# 本番用のビルド（public/ フォルダに生成されます）
build:
	hugo --minify

# 生成された成果物やキャッシュの削除
clean:
	rm -rf public/ resources/
