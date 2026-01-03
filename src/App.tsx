import { useState, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  Typography, 
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material'

interface Topic {
  Id:          number;
  Title:       string;
  Description: string;
}

function App() {
  const [topics, setTopics] = useState<Topic[]>([])

  // NTS: State to control the pop-up window
  const [open, setOpen] = useState(false)

  const [title, setTitle] = useState("")
  
  const [desc, setDesc] = useState("")

  const [editId, setEditId] = useState<number | null>(null)

  useEffect(() => {
    fetch("http://localhost:8080")
      .then(response => response.json())
      .then(data => setTopics(data))
      .catch(error => console.error("Error fetching data:", error))
  }, []) // no dependencies so this'll run only once. NTS: Need to read more about this

  const handleCreateOpen = () => {
    setEditId(null); // NTS: This is to make sure we are in 'create' mode
    setTitle("");    // This clears old text
    setDesc("");
    setOpen(true);
  }

  const handleEditOpen = (t: Topic) => {
    setEditId(t.Id);  // NTS: This is to make sure we are in 'edit' mode
    setTitle(t.Title);
    setDesc(t.Description);
    setOpen(true);
  }

  const handleSubmit = () => {
    if (!title || !desc) {
      alert("Please fill in both fields");
      return;
    }

    const newTopic = { Title: title, Description: desc}

    // DEFAULT: "POST" - 'create' mode
    let url = "http://localhost:8080/topics";
    let method = "POST";
    
    // BASED ON editId, SWTICH (or don't) TO "PATCH" - 'edit' mode
    if (editId != null) {
      url = `http://localhost:8080/topics/${editId}`;
      method = "PATCH";
    }
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTopic),

    })
      .then((response) => {
        if (response.ok) {
          // NTS: This part is supposed to close the dialog + refresh
          setOpen(false);
          window.location.reload();
        } else {
          // NTS: This branch is only if the request fails
          alert("Failed to create topic");
        }
      })
      .catch((error) => console.error("Error:", error));
    };

  const handleDelete = (id: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this topic? ");
    if (!isConfirmed) {
      return;
    }

    fetch(`http://localhost:8080/topics/${id}`, {
      method: "DELETE",
    })
    .then((response) => {
      if (response.ok) {
        window.location.reload();
      } else {
        alert("Failed to delete topic");
      }
    })
    .catch((error) => console.error("Error:", error));
  };

  return (
    <div style = {{ padding: "40px" }}>
      {/* Section for Header*/}
      <Typography variant = "h4" gutterBottom>
        CVWO Forum
      </Typography>

      {/* Button that will open the dialog box */}
      <Button variant = "contained" onClick = {handleCreateOpen}> {/* I could have also written {() => handleCreateOpen()}> but didn't as this requires zero arguments to run*/}
        Create Topic
      </Button>

      {/* Actual topic goes here */}
      <Stack spacing = {2} marginTop = {2}> 
        {topics.map((topic) => (
          <Card key = {topic.Id} >
            <CardContent>
              {/* Row Stack was used here to put Title and Button side-by-side */}
              <Stack direction = "row" justifyContent = "space-between" alignItems="center">
                <Typography variant = "h5" component = "div">
                  {topic.Title}
                </Typography>

                <Stack direction = "row" spacing = {1}>

                  <Button
                    variant = "text"
                    onClick = {() => handleEditOpen(topic)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant = "text"
                    color = "error"
                    onClick = {() => handleDelete(topic.Id)}
                  >
                    Delete
                  </Button>
                  
                </Stack>
              
              </Stack>
    
              <Typography variant = "body1" color = "text.secondary">
                {topic.Description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
      
      {/* Dialog, NTS: Only shows when open = true. Is invisible otherwise */}
      <Dialog open = {open} onClose = {() => setOpen(false)} fullWidth maxWidth = "sm">
        <DialogTitle>Create New Topic</DialogTitle>
        <DialogContent>
          <Stack spacing = {2} marginTop = {1}>

            <TextField 
              label = "Title" 
              variant = "outlined" 
              fullWidth 
              value = {title} // NTS: This reads the title state
              onChange = {(e) => setTitle(e.target.value)} // Update the title state
            />

            <TextField 
              label = "Description" 
              variant = "outlined" 
              multiline 
              rows = {4} 
              fullWidth 
              value = {desc} // NTS: This reads the desc state
              onChange = {(e) => setDesc(e.target.value)} // Update the desc state
            />

          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick = {() => setOpen(false)}>Cancel</Button>
          <Button variant = "contained" onClick = {() => handleSubmit()}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  )

}

export default App
