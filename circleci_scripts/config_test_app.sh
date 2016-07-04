if [ -z "${TestApp}" ]; then # TestApp format: [app_id]:[app_key]:[JP|CN3|SG|US|EU]:[token].
  echo "Need to configure specified test app for testing in circleci"
  exit 1
fi

#split app into array
AppInfo=(${TestApp//:/ })

if [ ${#AppInfo[@]} -ne 4 ] ; then
  echo "invalid format of TestApp: ${TestApp}"
  exit 1
fi

# replace in the file
sed -i 's/\(APPID = "\)\(.*\)\(".*$\)/\1'${AppInfo[0]}'\3/' 'test/utils/TestApp.ts'
sed -i 's/\(APPKEY = "\)\(.*\)\(".*$\)/\1'${AppInfo[1]}'\3/' 'test/utils/TestApp.ts'
sed -i 's/\(SITE = Site."\)\(.*\)\(";$\)/\1'${AppInfo[2]}'\3/' 'test/utils/TestApp.ts'
sed -i 's/\(TOKEN = "\)\(.*\)\(".*$\)/\1'${AppInfo[3]}'\3/' 'test/utils/TestApp.ts'
