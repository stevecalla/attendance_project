VERFIFY CURRENT USER CODE 
```//  USED TO VERIFY TEACHER IS IN THE DB; IF NOT THE TRANSFORMER WILL RETURN A TEST TEACHER
const teacher_list = {{ teacherEmails.data.email_address }};
let current_retool_user_email = {{ current_user.email }};
let current_retool_user_fullname = {{ current_user.fullName }};
let current_retool_user_photo_url = {{ current_user.profilePhotoUrl }};

current_retool_user_email = 'a'; // test code with invalid email address

let current_user = {email: '', fullname: '', photo: ''};
let [email, fullname, photo] = ['bessie_doodle@dogHouse.com', 'Bessie Doodle', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSP3bdlVdnfxYjFDRwBq_4ctl8_nTjucPHhTmryMW1FQdE9nitLrTHWzCqtnRkom0IFuzA&usqp=CAU'];

console.log(teacher_list.includes(current_retool_user_email))
teacher_list.includes(current_retool_user_email) ? current_user = { 
    email: current_retool_user_email, 
    fullname: current_retool_user_fullname, 
    photo: current_retool_user_photo_url } : 
    current_user = { ...current_user, email, fullname, photo };

//  console.log(current_user);
// to test the function in the console use console.log(verifyCurrentUser);

return current_user;
```
--------- CREATE CUSTOM FILTER FOR FIRST AND LAST NAME ----
```
THIS CODE SEARCHES THE LAST AND FIRST NAME COLUMN ONLY
IT RETURNS A PARTIAL MATCH AFTER A MINIMUM OF 2 CHARACTERS INPUT
SELECT 
    a.attendance_id AS id,
  	 s.school_name,
     a.attendance_date,
     c.class_name,
     CONCAT(t.last_name, ", ", t.first_name) AS teacher,
     CONCAT(d.last_name, ", ", d.first_name) AS student,
     a.is_present,
     a.status
FROM attendance_db.attendance_data as a
LEFT JOIN attendance_db.classes_data as c ON c.class_id = a.class_id
LEFT JOIN attendance_db.schools_data as s ON s.school_id = a.school_id
LEFT JOIN attendance_db.students_data as d ON d.student_id = a.student_id
LEFT JOIN attendance_db.teachers_data as t ON t.teacher_id = a.teacher_id;

SELECT
  a.attendance_id AS id,
  s.school_name,	
  a.attendance_date,
  c.class_name,
  CONCAT(t.last_name, ", ", t.first_name) AS teacher,
  CONCAT(d.last_name, ", ", d.first_name) AS student,
  a.is_present,
  a.status,
  c.class_id,
  d.student_id
FROM
  attendance_db.attendance_data AS a
  LEFT JOIN attendance_db.classes_data AS c ON c.class_id = a.class_id
  LEFT JOIN attendance_db.schools_data AS s ON s.school_id = a.school_id
  LEFT JOIN attendance_db.students_data AS d ON d.student_id = a.student_id
  LEFT JOIN attendance_db.teachers_data AS t ON t.teacher_id = a.teacher_id
 WHERE  
   {{!search_by_student_input.value}} -- if search box empty
   OR  
   LENGTH({{search_by_student_input.value}}) >= 2 -- Check minimum length
   AND 
   (LOWER(d.first_name) LIKE CONCAT('%', LOWER({{search_by_student_input.value}}), '%') -- partial match
   OR 
   LOWER(d.last_name) LIKE CONCAT('%', LOWER({{search_by_student_input.value}}), '%') -- partial match
   )

-- a.attendance_date = '2024-04-25'
-- FORMAT_DATE('%Y-%m-%d', a.attendance_date) IN  ('2024-04-30', '2024-05-01')
-- -- FORMAT_DATE('%Y-%m-%d', a.attendance_date) =  '2024-04-25'
-- FORMAT_DATE('%Y-%m-%d', a.attendance_date) =  '2024-05-01'

ORDER BY
  d.last_name, a.attendance_date
```

CLEAR CHANGE SET ARRAY CODE
```// if change set array is not empty then clear it
function isNotEmptyObject(obj) {
  return Object.keys(obj).length > 0;
}

await isNotEmptyObject(table_8.changesetArray) && table_8.clearChangeset();
```

CODE TO CREATE GRAPH ON THE DASHBOARD

TRANSFORM THE SOURCE DATA INTO FORMAT FOR GRAPH
```
// to view the rawData
// const rawData = {{ dateStats.data }};
// console.log(rawData);

let formattedData = {{
          formatDataAsArray(dateStats.data).map(element => (
            { 
              date: moment(element.attendance_date).format('l'),
              date_day_of_week: moment(element.attendance_date).format("dd, MM/DD/YY"),
              percent_present: element.percent_present * 1,
              percent_present_string: (element.percent_present * 100).toFixed(0) + "%",
              count_absent: element.absent,
              count_present: element.present
            }
          ))
}};


return formattedData;
```
PLOTLY JSON CODE
```
[
  {
    "name": "% Present",
    "x": {{formatDataAsObject( createChartData.value ).date_day_of_week}},
    "y": {{formatDataAsObject( createChartData.value ).percent_present}},
    "yaxis": "y2",
    
    "text": {{formatDataAsObject( createChartData.value ).percent_present_string}},
    "textposition": "top center",
    "textfont": {'color': 'black', 'size': '20', "font-family": "Arial", "weight": "bold", "style": 'italic'},
    "texttemplate": "%{text}",
  
    "showarrow": 'true',
    "arrowhead": 1,
  
    "bordercolor": "#c7c7c7",
    "borderwidth": '2',
    "borderpad": '4',
    "bgcolor": "#ff7f0e",
    "opacity": '0.8',
  
    "type": "line",
    "hovertemplate": "<b>%{x}</b><br>%{fullData.name}: %{y}<extra></extra>",
    "transforms": [
      {
        "type": "sort",
        "target": {{formatDataAsObject( createChartData.value ).date}},
        "order": "ascending"
      },
      {
        "type": "aggregate",
        "groups": {{formatDataAsObject( createChartData.value ).date}},
        "aggregations": [
          {
            "target": "y",
            "func": "sum",
            "enabled": true
          }
        ]
      }
    ],
    "marker": {
      "color": "#60A5FA"
    },
    "mode": "lines+text"
  },
  {
    "name": "Absent Count",
    "x": {{formatDataAsObject( createChartData.value ).date_day_of_week}},
    "y": {{formatDataAsObject( createChartData.value ).count_absent}},
    "type": "bar",
    "hovertemplate": "<b>%{x}</b><br>%{fullData.name}: %{y}<extra></extra>",
    "transforms": [
      {
        "type": "sort",
        "target": {{formatDataAsObject( createChartData.value ).date}},
        "order": "ascending"
      },
      {
        "type": "aggregate",
        "groups": {{formatDataAsObject( createChartData.value ).date}},
        "aggregations": [
          {
            "target": "y",
            "func": "sum",
            "enabled": true
          }
        ]
      }
    ],
    "marker": {
      "color": "red"
    }
  },
  {
    "name": "Present Count",
    "x": {{formatDataAsObject( createChartData.value ).date_day_of_week}},
    "y": {{formatDataAsObject( createChartData.value )['count_present']}},
    "type": "bar",
    "hovertemplate": "<b>%{x}</b><br>%{fullData.name}: %{y}<extra></extra>",
    "transforms": [
      {
        "type": "sort",
        "target": {{formatDataAsObject( createChartData.value ).date}},
        "order": "ascending"
      },
      {
        "type": "aggregate",
        "groups": {{formatDataAsObject( createChartData.value ).date}},
        "aggregations": [
          {
            "target": "y",
            "func": "sum",
            "enabled": true
          }
        ]
      }
    ],
    "marker": {
      "color": "green"
    }
  }
]
```

PLOTLY LAYOUT
```
{
  "title": {
    "text": "",
    "font": {
      "color": "#3D3D3D",
      "size": 16
    }
  },
  "font": {
    "family": "var(--default-font, var(--sans-serif))",
    "color": "#979797"
  },
  "showlegend": true,
  "legend": {
    "xanchor": "center",
    "x": 0.45,
    "y": -0.2,
    "orientation": "h"
  },
  "margin": {
    "l": 16,
    "r": 75,
    "t": 24,
    "b": 32,
    "pad": 2
  },
  "hovermode": "closest",
  "hoverlabel": {
    "bgcolor": "#000",
    "bordercolor": "#000",
    "font": {
      "color": "#fff",
      "family": "var(--default-font, var(--sans-serif))",
      "size": 12
    }
  },
  "clickmode": "select+event",
  "dragmode": "select",
  "xaxis": {
    "title": {
      "text": "",
      "standoff": 6,
      "font": {
        "size": 12
      }
    },
    "type": "-",
    "tickformat": "",
    "automargin": true,
    "fixedrange": true,
    "gridcolor": "#fff",
    "zerolinecolor": "#fff"
  },
  "yaxis": {
    "title": {
      "text": "Count",
      "standoff": 5,
      "font": {
        "size": 12
      }
    },
    "type": "linear",
    "tickformat": "",
    "automargin": true,
    "fixedrange": true,
    "zerolinecolor": "#DEDEDE"
  },
  "yaxis2": {
    "title": {
      "text": "Percent Present",
      "standoff": 15,
      "font": {
        "size": 12
      }
    },
    "side": "right",
    "overlaying": "y",
    "type": "linear",
    "tickformat": "%",
    "zerolinecolor": "#DEDEDE",
    "range": [0,1.15]
  }

}
```
