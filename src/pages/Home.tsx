import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
import { type Post } from '../types'

function Home() {
  const [posts, setPosts] = useState<Post[]>([])

  const [open, setOpen] = useState(false)

  const [title, setTitle] = useState("")
  
  const [desc, setDesc] = useState("")

  const [editId, setEditId] = useState<number | null>(null)

  useEffect(() => {
    fetch("http://localhost:8080/posts")
      .then(response => response.json())
      .then(data => setPosts(data || []))
      .catch(error => console.error("Error fetching data:", error))
  }, []) 

  const handleCreateOpen = () => {
    setEditId(null); 
    setTitle("");    
    setDesc("");
    setOpen(true);
  }

  const handleEditOpen = (p: Post) => {
    setEditId(p.Id);  
    setTitle(p.Title);
    setDesc(p.Description);
    setOpen(true);
  }

  const handleSubmit = () => {
    if (!title || !desc) {
      alert("Please fill in both fields");
      return;
    }

    const newPost = { Title: title, Description: desc}

    let url = "http://localhost:8080/posts";
    let method = "POST";
    
    if (editId != null) {
      url = `http://localhost:8080/posts/${editId}`;
      method = "PATCH";
    }
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),

    })
      .then((response) => {
        if (response.ok) {
          setOpen(false);
          window.location.reload();
        } else {
          alert("Failed to save post");
        }
      })
      .catch((error) => console.error("Error:", error));
    };

  const handleDelete = (id: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this post? ");
    if (!isConfirmed) {
      return;
    }

    fetch(`http://localhost:8080/posts/${id}`, {
      method: "DELETE",
    })
    .then((response) => {
      if (response.ok) {
        window.location.reload();
      } else {
        alert("Failed to delete post");
      }
    })
    .catch((error) => console.error("Error:", error));
  };

  return (
    <div style = {{ padding: "40px" }}>
      <Typography variant = "h4" gutterBottom>
        CVWO Forum
      </Typography>

      <Button variant = "contained" onClick = {handleCreateOpen}> 
        Create Post
      </Button>

      <Stack spacing = {2} marginTop = {2}> 
        {posts.map((post) => (
          <Card key = {post.Id} >
            <CardContent>
              <Stack direction = "row" justifyContent = "space-between" alignItems="center">
                
                <Link to={`/posts/${post.Id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography variant="h5" component="div" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                        {post.Title}
                    </Typography>
                </Link>

                <Stack direction = "row" spacing = {1}>

                  <Button
                    variant = "text"
                    onClick = {() => handleEditOpen(post)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant = "text"
                    color = "error"
                    onClick = {() => handleDelete(post.Id)}
                  >
                    Delete
                  </Button>
                  
                </Stack>
              
              </Stack>
    
              <Typography variant = "body1" color = "text.secondary">
                {post.Description}
              </Typography>

              <Typography variant = "caption" display = "block" sx = {{ mt: 1, color: 'gray'}}>
                Posted by {post.Username} • {new Date(post.CreatedAt).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
      
      <Dialog open = {open} onClose = {() => setOpen(false)} fullWidth maxWidth = "sm">
        <DialogTitle> {editId ? "Edit Post" : "Create New Post"}</DialogTitle>
        <DialogContent>
          <Stack spacing = {2} marginTop = {1}>

            <TextField 
              label = "Title" 
              variant = "outlined" 
              fullWidth 
              value = {title} 
              onChange = {(e) => setTitle(e.target.value)} 
            />

            <TextField 
              label = "Description" 
              variant = "outlined" 
              multiline 
              rows = {4} 
              fullWidth 
              value = {desc} 
              onChange = {(e) => setDesc(e.target.value)} 
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

export default Home