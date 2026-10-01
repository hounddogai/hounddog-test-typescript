import fs from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";

const writeAndDownloadData = (fileName, data, res) => {
  // Write to the OS temp directory, never outside it, and send the file as a download.
  const filePath = join(tmpdir(), basename(fileName));
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFile(filePath, jsonData, "utf8", (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      res.status(500).send("Error creating data!"); // Send error response
      return;
    }
    console.log("Data written to file successfully!");
    // Send as a plain text attachment, then delete the temporary file whether or not the download completed.
    res.download(filePath, "data.txt", (downloadErr) => {
      if (downloadErr) {
        console.error("Error sending file:", downloadErr);
      }
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting temporary file:", unlinkErr);
        }
      });
    });
  });
};

export default writeAndDownloadData;
