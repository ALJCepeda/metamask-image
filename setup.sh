apt-get update
apt-get install -y curl git vim zsh docker chromium xvfb
curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh | zsh
sed -i "s/ZSH_THEME=.*/ZSH_THEME=\"bira\"/" ~/.zshrc
yarn install
yarn fetch-metamask
