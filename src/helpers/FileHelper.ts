export class FileHelper {

    static binaryStringToImageSource(binaryString: string) {
        const base64 = Buffer.from(binaryString, 'binary').toString('base64');
        return `data:image/png;base64,${base64}`

        // Use like <img src={FileHelper.binaryStringToImageSource(binary)} />
    }
}