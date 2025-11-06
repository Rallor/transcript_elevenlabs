1. In array **call_id_array** add list of files ids
2. Create .env and add
* ELEVENLABS_API_KEY=
*    WEBITEL_APi_KEY=
*    BD_USER=
*    BD_HOST=
*    BD_DATABASE=
*    BD_PASSWORD=
*    BD_PORT=

In your PG DataBase you need to create table and schema:
`CREATE TABLE okko.transcript_call (
	id bigserial NOT NULL,
	sentence varchar NULL,
	speakerid varchar NULL,
	sentence_id int4 null,
	file_id int4 NULL,
	create_at timestamptz DEFAULT now() NULL
);`

run `npm install` 

run `npm run start`

Check you database
![img.png](img.png)
