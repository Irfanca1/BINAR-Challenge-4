# BINAR-Challenge4 - Car Management Dashboard
Membuat sebuah aplikasi car management dashboard yang sudah menginplementasikan CRUD menggunakan PostgreSQL dengan menggunakan express.js dan sequelize


# ERD
![alt text](https://github.com/Irfanca1/BINAR-Challenge4/blob/master/ERD%20Car.png?raw=true)

# ENDPOINT REST API 
* Tampil Data 
> GET http://localhost:5000/api/car  
>  
> Contoh Request & Response Body  
>   
![alt text](https://github.com/Irfanca1/BINAR-Challenge4/blob/master/public/rest-img/get.png?raw=true)
  
* Tambah Data 
> POST http://localhost:5000/api/car/posts    
>  
> Contoh Request & Response Body  
>   
![alt text](https://github.com/Irfanca1/BINAR-Challenge4/blob/master/public/rest-img/post.png?raw=true)
  
  
* Ubah Data 
> POST http://localhost:5000/api/car/update/:id    
>  
> Contoh Request & Response Body  
>   
![alt text](https://github.com/Irfanca1/BINAR-Challenge4/blob/master/public/rest-img/update.png?raw=true)
  
* Hapus Data 
> GET http://localhost:5000/api/car/delete/:id    
>  
> Contoh Request & Response Body  
>   
![alt text](https://github.com/Irfanca1/BINAR-Challenge4/blob/master/public/rest-img/delete.png?raw=true)
