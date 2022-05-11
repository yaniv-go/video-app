# video-app
simple video sharing website capable of uploading videos and creating playlists.

# built with
* express
* React (MUI)
* mongoose
* gcp

# prerequisites
install node >= v16.15.0, ffmpeg and have a gcp project with a corresponding bucket

# getting up and running

**must** have folowing enviroment variables:
* MONGODB_URL=mongodb url
* GOOGLE_APPLICATION_CREDENTIALS=google application authentication json path
* BUCKET_NAME=name of bucket to use in google project
* FFMPEG_PATH and FFPROBE_PATH=must provide path for ffmpeg and ffprobe if not in global path
* JWT_SECRET=some random string to use as secret

**optional** enviroment variables:
* PORT=port to use for backend default is 3001 if port is changed must change proxy in ./front/package.json
* MAX_OBJECTS_SEND=max json objects to send in server response default is 1000
* MAX_FILE_SIZE=maximum allowed file size default is 500mb

after providing variables and fullfiling prerequisites open two terrminals in project folder:

first terminal
```terminal
npm i && npm run start
```

second terminal 
```tertminal
cd front && npm i && npm start
```

# Demo
demo credentials:
  email: abcd@gmail.com
  password: 123456789
[Demo](https://video-sharing-gottlieb.herokuapp.com/home)
