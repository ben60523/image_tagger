![Frame 3 (3)](https://user-images.githubusercontent.com/63446591/131225786-be6a7eab-d46e-4c3d-be1e-0b8640c86802.png)

# What's Image_tagger
Image is a cross-platform annotation application that help user annotates the images and share to others.

# Download link
[media_tagger 1.9.1](https://downloadfroms3.s3.ap-northeast-2.amazonaws.com/media_tagger_1.9.1_setup.exe) Installer for Windows 10, 64-bit.

# Quick guide
![](https://i.imgur.com/QDkrmPR.jpg)

1. `Import`button
3. `Open Folder` button
4. the current working folder/zip file
5. List images in the working folder/zip file
6. `Export` button: To export the working files
7. Image file name
8. `Refresh` button: Clean up all the tags
9. `Snapshot` button: Take a snapshot of the annotated image
10. Labels (types of annotations)
11. Annotations

[For more details](https://hackmd.io/@iJR7h8jYSP-QULUBWb122A/HJAjSYm-t)

# Development

## Tech stack
1. Electron
3. ReactJS
4. webpack
5. React Hook
6. babel
7. Jest

## How to install?
```bash
npm install
```

## How to start?
After running start, when the code changed it will auto-update
```bash
npm start
```

## How to test?
```bash
npm test
```

## How to build different version?
1. run on specific flatform
2. run instruction

```bash
npm run dist
```

# Todo List
- [ ] Extract frontend code(for web version)
- [ ] Try CI/CD (auto build and update the application to s3)
- [ ] Try style conponent
- [ ] Setting backend(firebase)
- [ ] release Mac OS version 



