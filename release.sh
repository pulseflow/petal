expected_release_message="The release type for the commit is"

echo "pulse/petal: Running semantic-release in --dry-run to see if we should trigger a Lerna release."
pnpm petal release --dry-run | grep "${expected_release_message}"

if [ $? -eq 0 ]
then
    echo "pulse/petal: A release will be triggered."
    echo "pulse/petal: Configuring git for Github Actions Lerna publish..."
    git config --global user.email "no-reply@dyn.gay"
    git config --global user.name "GitHub Action"
    git remote set-url origin "https://${GH_USERNAME}:${GH_TOKEN}@github.com/pulseflow/petal.git"
    git checkout main
    echo "pulse/petal: Configuring npm for publishing..."
    echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" >> ~/.npmrc
    echo "pulse/petal: Attempting publish..."
    pnpm dlx lerna publish --yes --force-publish --ignore-scripts --conventional-commits --create-release=github --registry=https://registry.npmjs.org
    exit $?
else
    echo "pulse/petal: No release will be triggered." >&2
    exit 0
fi