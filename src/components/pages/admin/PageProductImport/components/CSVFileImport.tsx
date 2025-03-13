import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    if (!file) return;
    console.log("uploadFile to", url);
    try {
      const response = await axios.get(url, {
        params: { name: file.name },
      });
      const signedUrl = response.data;
      const result = await fetch(signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "text/csv",
        },
        body: file,
      });
      if (result.ok) {
        alert("File uploaded successfully.");
      } else {
        alert("File upload failed.");
      }
      removeFile();
    } catch (error) {
      console.error("Error uploading file: ", error);
      alert("Error uploading file.");
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
