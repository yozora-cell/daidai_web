#!/usr/bin/env bash

OS=$(uname -s)

if [ "$OS" = "Darwin" ]; then
  DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
else
  full_path=$(realpath $0)
  DIR=$(dirname $full_path)

fi

# DIRRoot=$(dirname $DIR)
echo $DIR

cd $DIR
$DIRRoot=/Volumes/data/source/daidaiio/
$DIRRemote=/Volumes/data/source/daidaiio/web

echo "src=$DIR dest=$DIRRoot" 
ansible proxyhome -m synchronize -a "src=$DIR dest=$DIRRoot" 
ssh  ubuntu@59.138.73.68 -t "chmod +x $DIRRemote/build_docker.sh"
ssh  ubuntu@59.138.73.68 -t "cp -r $DIRRemote/.env.product $DIRRemote/.env"
ssh  ubuntu@59.138.73.68 -t $DIRRemote/build_docker.sh

