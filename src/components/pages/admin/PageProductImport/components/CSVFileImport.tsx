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
      setFile(files[0]);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    if (!file) return;
    console.log("Uploading file to", url);
    try {
      const authorizationToken = localStorage.getItem("authorization_token");

      const headers: Record<string, string> = {};

      if (authorizationToken) {
        headers.Authorization = `Basic ${authorizationToken}`;
      }

      const response = await axios.get(url, {
        params: { name: file.name },
        headers: headers
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

      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          alert("Unauthorized: Authentication required. Please set an authorization token in localStorage.");
        } else if (error.response.status === 403) {
          alert("Forbidden: You don't have permission to access this resource. Please check your credentials.");
        } else {
          alert(`Error uploading file: ${error.response.status} ${error.response.statusText}`);
        }
      } else {
        alert("Error uploading file.");
      }
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