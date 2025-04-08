
export function formatChatTime(createdAt) {
  const date = new Date(createdAt);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (isYesterday) {
    return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
export const validateForm = (formData,toast) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/; 

  if (!formData.fullname.trim()) return toast.error("Full name required!");
  if (!formData.email.trim()) return toast.error("Email required!");
  if (!emailRegex.test(formData.email.trim()))
    return toast.error("Enter Correct Email!");
  if (!formData.username.trim()) return toast.error("Username required!");
  if (!usernameRegex.test(formData.username.trim()))
     return toast.error("Username must be 3-16 characters long and contain only letters, numbers, or underscores.");
  if (!formData.password) return toast.error("Password required!");
  if (formData.password.length < 6)
    return toast.error("Password must be at least 6 characters!");

  return true;
};