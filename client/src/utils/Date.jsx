export const DatetoString = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInSeconds = Math.abs(now - messageDate) / 1000;
    const diffInHours = diffInSeconds / 3600;
    const diffInDays = diffInHours / 24;

    if (diffInHours < 1) {
        // If the message was sent less than an hour ago, display the time
        return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24) {
        // If the message was sent less than a day ago, display 'Today'
        return 'Today';
    } else if (diffInDays < 2) {
        // If the message was sent less than two days ago, display 'Yesterday'
        return 'Yesterday';
    } else if (diffInDays < 7) {
        // If the message was sent less than a week ago, display the day of the week
        return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
        // If the message was sent more than a week ago, display the date
        return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
}

