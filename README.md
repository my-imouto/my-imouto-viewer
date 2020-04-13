# My.Imouto Viewer

This is a mini imageboard created just to learn some React and Apollo for React.

* Can search and show images
* No editing
* Desktop support only
* Creates images from backend only
* Converts files to JPEG

## Requirements

* ImageMagick:
  * Option 1: Download ImageMagick portable binary from [ImageMagick page](https://imagemagick.org/script/download.php) and save as `/backend/magick`
  * Option 2: Use ImageMagick-Native package. For this to work, Node v10.13.0 is needed because the package doesn't work with newer versions. Additional installation steps in [imagemagick-native package page](https://www.npmjs.com/package/imagemagick-native#installation)
* An HTTP server
* MongoDB 4.2+ (it should work with 3.4+ though)

## Installation

* Go to `backend`
* Install dependencies: `npm install`
* Build files: `npm run build`
* Make a copy of `.env.example` named `.env`, and configure accordingly
* Create a user: `node script create-user`
* Now go to `frontend`
* Install dependencies: `npm install`
* Build files: `npm run build`

## NGINX

This was made with NGINX in mind (overkill but cleaner). The required configuration is in the `nginx.prod.conf` file. Set up steps in a basic Ubuntu environment:

* Copy the file to sites-available directory: `sudo cp nginx.prod.conf /etc/nginx/sites-available/myimouto`
* With your favorite editor, edit line 5 of the file so the path to the `my-imouto-viewer` folder is correct
* Make a softlink in sites-enabled: `sudo ln -s /etc/nginx/sites-available/myimouto /etc/nginx/sites-enabled/myimouto`
* Reload nginx: `sudo systemctl reload nginx`

## Running the system

* Run the backend system: `npm run start:prod`

## Creating images

Currently, the only way to create images is to place them in the `import` folder, then run the `import` script (in `./backend`): `node script import`. Note that the images won't be deleted from the folder.

## Using the UI

* To show the search bar, either press `s` or move the mouse over the top of the window.
* Search by tags, e.g. `seifuku nekomimi -maid` will search images with tags seifuku and nekomimi but without maid.
* When viewing an image, press `f` to toggle fit screen, and `v` to enter View Mode (to exit View Mode, press `f`).
