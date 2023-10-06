<h1 align="center">UlaanbaatarBot</h1>
<p align="center">Makes edits on Mongolian Wikipedia</p>

## Google Sheets
See: https://docs.google.com/spreadsheets/d/1joX9r-2ycIuMTfmsq1VxEyeUy-wzk0TlhfxYm1dbrkQ/edit

* `g:createCats`
* `g:csvCat`
* `g:deleteCats`
* `g:fetchArticles`
* `g:insertInterwiki`
* `g:renameCats`
* `g:replaceCats`
* `g:translateCats`

## Cron

* `cron:getUncategorised`
* `cron:copySheetData`

# Setup
1. `nvm use`
1. `npm install`

## Required Secrets
Both Available from [Github Secrets](https://github.com/chintogtokh/UlaanbaatarBot/settings/secrets/actions).

* `googleconfig.json` (abse64 encoded under `GOOGLE_B64`)
* `.env` 

