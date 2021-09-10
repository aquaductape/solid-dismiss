#!/bin/bash
# https://gist.github.com/cobyism/4730490#gistcomment-1374989 current
# https://gist.github.com/cobyism/4730490#gistcomment-1394421 better but you don't have set up that way currently

branch="gh-pages"
output="demo-dist"

if [ $(git status --porcelain | wc -l) -eq "0" ]; then
  echo -e "  🟢 Git repo is clean.\n"
else
  echo "  🔴 Git repo dirty. Quit"
  exit 1
fi

function subtree_push() {
    git subtree push --prefix $output origin $branch
}

function subtree_split() {
    git push origin $(git subtree split --prefix $output main):gh-pages --force
}

function is_in_remote() {
    local git_command="git ls-remote --heads origin ${branch}"
    local existed_in_remote=$($git_command)

    if [[ ${existed_in_remote} ]]; then
        echo "\nremote branch $branch exists"
        echo "\n$git_command\n"
        echo -e "\n$existed_in_remote\n"
        echo -e "\nupdate $branch against a rebased master branch\n"
        subtree_split

    else
        echo -e "\nthere's no remote branch $branch\n"
        subtree_push
    fi
}

echo -e "\nbuilding $output...\n" &&
    npm run build &&
    echo -e "\ntracking $output by removing it in gitingore\n"
sed -i -- "s/$output//g" ./.gitignore &&
    git add . &&
    echo -e "\ncommitting $output in order to push demo-dist subtree for $branch...\n"
git commit -m "update $output subtree for $branch" &&
    is_in_remote

echo -e "\nremoving $output commit, reseting to previous commit\n"
git reset --hard HEAD~1
echo -e "\nComplete!"
