export const formatDateToKhmer = (date: string | Date): string => {
  const khmerMonths = [
    "មករា", "កុម្ភៈ", "មិនា", "មេសា", "ឧសភា", "មិថុនា", 
    "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ",
  ];

  const khmerDays = [
    "ថ្ងៃអាទិត្យ", "ថ្ងៃច័ន្ទ", "ថ្ងៃអង្គារ", "ថ្ងៃពុធ", 
    "ថ្ងៃព្រហស្បតិ៍", "ថ្ងៃសុក្រ", "ថ្ងៃសៅរ៍",
  ];

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "Invalid Date";

  const day = dateObj.getDate();
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();
  const dayOfWeek = dateObj.getDay();

  return `${khmerDays[dayOfWeek]}, ${day} ${khmerMonths[month]} ${year}`;
};
