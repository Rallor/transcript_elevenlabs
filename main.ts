// @ts-ignore
import dotenv from "dotenv";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import * as process from "node:process";
import { Client } from 'pg';
dotenv.config();


const call_id_array = [1] //ТУТ спи сок ІД файлів які треба додати транскрибацію

async function writeToDatabase(pgclient:any, data:object) {
    return await pgclient.query(`INSERT INTO okko.transcript_call (transcript,file_id) VALUES ('${JSON.stringify(data).replace(/'/g, "''")}',3) RETURNING *`)
}

async function main() {
    const pgclient = new Client({
        user: `${process.env.BD_USER}`,
        host: `${process.env.BD_HOST}`,
        database: `${process.env.BD_DATABASE}`,
        password: `${process.env.BD_PASSWORD}`,
        port: `${process.env.BD_PORT}`,
    });
    await pgclient.connect();

    const client = new ElevenLabsClient({
        environment: "https://api.elevenlabs.io",
    });
    try {
        for (const call_id of call_id_array) {
            const response = await client.speechToText.convert({
                apiKey: process.env.ELEVENLABS_API_KEY,
                modelId: "scribe_v1",
                num_speakers:3,
                language_code:"uk",
                diarize:"true",
                cloudStorageUrl: `https://gngitsmtech.blob.core.windows.net/$web/034842d1-c187-4f5b-be2a-e6af1cd1178c_%20380964918295_7030.mp3`,

            });
            await writeToDatabase(pgclient, response).then(data => console.log(`Call id ${call_id} create`));
        }
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await pgclient.end();
    }
}
main();