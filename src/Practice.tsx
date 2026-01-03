// src/Practice.tsx
import { Card, CardContent, Typography } from '@mui/material';

interface PracticeProps {
    title: string;
    desc: string;
}

function Practice(props: PracticeProps) {
  return (
    <Card>
        <CardContent>
            <Typography variant = "h5">{props.title}</Typography>
            <Typography variant = "body1">{props.desc}</Typography>
        </CardContent>
    </Card>
  );
}

export default Practice;