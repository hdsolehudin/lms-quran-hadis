insert into profiles (id,nis,name,class_name,role)
values ('cae02fb2-f815-43a3-9b38-cf9d010b6491','12345','Alfira Nurhaliza','XII','student')
on conflict (id) do update set nis='12345',name='Alfira Nurhaliza',class_name='XII',role='student';
