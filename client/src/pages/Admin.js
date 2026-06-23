import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
const SAMPLE_PRODUCTS = [
  // PHONES
  { name: 'iPhone 15 Pro', description: 'Latest Apple smartphone with A17 chip, titanium design', price: 134900, category: 'Electronics', image: 'https://images.macrumors.com/article-new/2023/09/iphone-15-pro-gray.jpg', stock: 30 },
  { name: 'iPhone 14', description: 'Apple iPhone 14 with A15 Bionic chip', price: 79900, category: 'Electronics', image: 'https://m.media-amazon.com/images/I/618Bb+QzCmL.jpg', stock: 25 },
  { name: 'Samsung Galaxy S24 Ultra', description: 'Samsung flagship with S Pen and AI features', price: 134999, category: 'Electronics', image: 'https://sell.gameloot.in/wp-content/uploads/sites/4/2024/02/Samsung-Galaxy-S24-Ultra-5G.jpg', stock: 20 },
  { name: 'OnePlus 12', description: 'Snapdragon 8 Gen 3 flagship killer smartphone', price: 64999, category: 'Electronics', image: 'https://fdn2.gsmarena.com/vv/pics/oneplus/oneplus-12-1.jpg', stock: 35 },
  { name: 'Google Pixel 8 Pro', description: 'Google AI powered flagship smartphone', price: 106999, category: 'Electronics', image: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-pro-1.jpg', stock: 15 },
  { name: 'Redmi Note 13 Pro', description: 'Best budget smartphone with 200MP camera', price: 26999, category: 'Electronics', image: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-13-pro-1.jpg', stock: 50 },
  { name: 'Vivo V29 Pro', description: 'Slim design with aura light portrait camera', price: 35999, category: 'Electronics', image: 'https://fdn2.gsmarena.com/vv/pics/vivo/vivo-v29-pro-1.jpg', stock: 30 },
  { name: 'Realme GT 5 Pro', description: 'Gaming smartphone with 144Hz display', price: 53999, category: 'Electronics', image: 'https://cdn1.smartprix.com/rx-iGNQcfeDW-w1200-h1200/realme-gt-5-pro.jpg', stock: 25 },
  // LAPTOPS
  { name: 'MacBook Air M2', description: 'Supercharged by M2 chip ultra thin design', price: 114900, category: 'Electronics', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80', stock: 20 },
  { name: 'MacBook Pro M3', description: 'Professional laptop with M3 Pro chip', price: 209900, category: 'Electronics', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80', stock: 15 },
  { name: 'Dell XPS 15', description: 'Premium Windows laptop with OLED display', price: 189990, category: 'Electronics', image: 'https://pctech.co.in/image/cache/catalog/Laptops/DELL/dell-xps-15-9530-laptop-03-800x800w.jpg', stock: 12 },
  { name: 'HP Spectre x360', description: '2-in-1 convertible laptop with pen support', price: 159990, category: 'Electronics', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80', stock: 10 },
  { name: 'Lenovo ThinkPad X1', description: 'Business ultrabook with military grade build', price: 149990, category: 'Electronics', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&q=80', stock: 8 },
  { name: 'ASUS ROG Zephyrus', description: 'Gaming laptop with RTX 4070 graphics', price: 179990, category: 'Electronics', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&q=80', stock: 10 },
  // AUDIO
  { name: 'Sony WH-1000XM5', description: 'Industry leading noise cancelling headphones', price: 29990, category: 'Electronics', image: 'https://assets.ajio.com/medias/sys_master/root/20240703/D0wA/6685d9391d763220fac4fdd2/-1117Wx1400H-4944431190-multi-MODEL.jpg', stock: 25 },
  { name: 'Apple AirPods Pro 2', description: 'Active noise cancellation with transparency mode', price: 24900, category: 'Electronics', image: 'https://www.flashify.in/cdn/shop/products/61sRKTAfrhL.jpg?v=1733946410&width=2560', stock: 40 },
  { name: 'boAt Rockerz 550', description: 'Wireless headphones with 20hr battery life', price: 1799, category: 'Electronics', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80', stock: 60 },
  { name: 'JBL Flip 6', description: 'Portable waterproof bluetooth speaker', price: 9999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80', stock: 35 },
  { name: 'Bose QuietComfort 45', description: 'Premium noise cancelling over ear headphones', price: 32990, category: 'Electronics', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80', stock: 20 },
  { name: 'Sony WF-1000XM5', description: 'True wireless earbuds with best ANC', price: 19990, category: 'Electronics', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwVuoVjNFd7RI2i6rLbx8Lz61xXVLNZcNk1g&s', stock: 30 },
  // TV
  { name: 'Samsung 4K QLED TV 55"', description: 'Crystal clear 4K QLED display smart TV', price: 57990, category: 'Electronics', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80', stock: 15 },
  { name: 'LG OLED TV 55"', description: 'Perfect blacks with OLED technology 4K', price: 124990, category: 'Electronics', image: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400&q=80', stock: 10 },
  { name: 'Sony Bravia 65" 4K', description: 'Google TV with Cognitive Processor XR', price: 149990, category: 'Electronics', image: 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=400&q=80', stock: 8 },
  // GAMING
  { name: 'PlayStation 5', description: 'Next gen gaming console with DualSense controller', price: 54990, category: 'Electronics', image: 'https://i5.walmartimages.com/seo/Sony-PlayStation-5-Video-Game-Console_b29e7500-cac2-4d1f-b4aa-5e0ebb3de124.c0b04249d968e2c1e5d25799b96ee0e3.jpeg', stock: 10 },
  { name: 'Xbox Series X', description: 'Most powerful Xbox ever 4K gaming', price: 52990, category: 'Electronics', image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&q=80', stock: 12 },
  { name: 'Nintendo Switch OLED', description: 'Hybrid gaming console play anywhere', price: 29999, category: 'Electronics', image: 'https://i5.walmartimages.com/seo/Nintendo-Switch-OLED-Sw-Oled-Model-w-White-Joy-Con-Bundle_38a43538-83e8-49d1-ba21-396f1df91242.4cf49aeff86fbdf4f3d96c61016ce21f.jpeg', stock: 20 },
  // TABLETS
  { name: 'iPad Pro 12.9"', description: 'Most powerful iPad with M2 chip', price: 112900, category: 'Electronics', image: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-ipad-pro-129-2022-1.jpg', stock: 18 },
  { name: 'Samsung Galaxy Tab S9', description: 'Android flagship tablet with S Pen', price: 74999, category: 'Electronics', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1eY3mmJAy25By--mtaE5z9ki9c_VfRNXEtA&s', stock: 15 },
  { name: 'iPad Air M1', description: 'Powerful iPad Air with M1 chip', price: 59900, category: 'Electronics', image: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-ipad-air-2022-1.jpg', stock: 20 },
  // CAMERAS
  { name: 'Canon EOS R50', description: 'Mirrorless camera for content creators', price: 69990, category: 'Electronics', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80', stock: 12 },
  { name: 'Sony Alpha A7 IV', description: 'Full frame mirrorless professional camera', price: 259990, category: 'Electronics', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80', stock: 8 },
  { name: 'GoPro Hero 12', description: 'Action camera 5.3K video waterproof', price: 44990, category: 'Electronics', image: 'https://m.media-amazon.com/images/I/71p5V8+OnfL._AC_UF1000,1000_QL80_.jpg', stock: 20 },
  // SHOES
  { name: 'Nike Air Max 270', description: 'Lightweight comfortable daily running shoes', price: 10795, category: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', stock: 50 },
  { name: 'Adidas Ultraboost 23', description: 'Responsive Boost cushioning for runners', price: 15999, category: 'Shoes', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80', stock: 40 },
  { name: 'Nike Air Force 1', description: 'Classic iconic white low top sneakers', price: 8695, category: 'Shoes', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80', stock: 45 },
  { name: 'Puma RS-X', description: 'Retro chunky sneaker with bold design', price: 8999, category: 'Shoes', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80', stock: 35 },
  { name: 'New Balance 574', description: 'Classic lifestyle sneaker all day comfort', price: 9999, category: 'Shoes', image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&q=80', stock: 30 },
  { name: 'Converse Chuck Taylor', description: 'Timeless canvas high top sneaker', price: 5999, category: 'Shoes', image: 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=400&q=80', stock: 60 },
  { name: 'Skechers Go Walk', description: 'Ultra comfortable walking shoes', price: 4999, category: 'Shoes', image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=400&q=80', stock: 50 },
  { name: 'Red Tape Formal Shoes', description: 'Premium leather formal Oxford shoes', price: 3499, category: 'Shoes', image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&q=80', stock: 35 },
  { name: 'Woodland Boots', description: 'Rugged outdoor leather boots waterproof', price: 5999, category: 'Shoes', image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&q=80', stock: 25 },
  { name: 'Reebok Classic Leather', description: 'Timeless classic leather sneaker', price: 6999, category: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', stock: 40 },
  // CLOTHING
  { name: "Levi's 501 Jeans", description: 'Original straight fit iconic denim jeans', price: 6999, category: 'Clothing', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80', stock: 60 },
  { name: 'Ralph Lauren Polo Shirt', description: 'Classic cotton polo shirt', price: 7495, category: 'Clothing', image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=400&q=80', stock: 45 },
  { name: 'Nike Dri-FIT T-Shirt', description: 'Moisture wicking performance t-shirt', price: 2495, category: 'Clothing', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', stock: 70 },
  { name: 'H&M Slim Fit Chinos', description: 'Slim fit stretch chino trousers', price: 2999, category: 'Clothing', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80', stock: 55 },
  { name: 'Zara Blazer', description: 'Slim fit formal blazer for men', price: 5999, category: 'Clothing', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80', stock: 30 },
  { name: 'Allen Solly Formal Shirt', description: 'Regular fit formal cotton shirt', price: 1999, category: 'Clothing', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80', stock: 65 },
  { name: 'Peter England Suit', description: 'Complete formal suit set for men', price: 12999, category: 'Clothing', image: 'https://images.unsplash.com/photo-1555069519-127aadedf1ee?w=400&q=80', stock: 20 },
  { name: 'US Polo Jacket', description: 'Casual hooded jacket windbreaker', price: 3999, category: 'Clothing', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80', stock: 40 },
  { name: 'Biba Kurti', description: 'Beautiful printed cotton kurti for women', price: 1499, category: 'Clothing', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80', stock: 70 },
  { name: 'Zara Floral Dress', description: 'Beautiful floral midi dress for women', price: 3999, category: 'Clothing', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80', stock: 45 },
  { name: 'H&M Denim Jacket', description: 'Classic denim jacket for women', price: 2999, category: 'Clothing', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80', stock: 40 },
  // BOOKS
  { name: 'Atomic Habits', description: 'Tiny Changes Remarkable Results by James Clear', price: 499, category: 'Books', image: 'https://images-na.ssl-images-amazon.com/images/I/81bGKUa1e0L.jpg', stock: 80 },
  { name: 'The Great Gatsby', description: 'F. Scott Fitzgerald timeless classic', price: 299, category: 'Books', image: 'https://images-na.ssl-images-amazon.com/images/I/71FTb9X6wsL.jpg', stock: 100 },
  { name: 'Rich Dad Poor Dad', description: 'Personal finance book by Robert Kiyosaki', price: 399, category: 'Books', image: 'https://www.crossword.in/cdn/shop/files/rich-dad-poor-dad-what-the-rich-teach-their-kids-about-money-bk0470310-44032852132057.jpg?v=1775116418', stock: 90 },
  { name: 'The Alchemist', description: 'Paulo Coelho inspirational novel', price: 299, category: 'Books', image: 'https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg', stock: 85 },
  { name: 'Think and Grow Rich', description: 'Napoleon Hill self improvement classic', price: 350, category: 'Books', image: 'https://m.media-amazon.com/images/I/61IxJuRI39L.jpg', stock: 75 },
  { name: 'Zero to One', description: 'Peter Thiel notes on startups', price: 499, category: 'Books', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80', stock: 60 },
  { name: 'Deep Work', description: 'Rules for focused success by Cal Newport', price: 449, category: 'Books', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80', stock: 70 },
  { name: 'The Psychology of Money', description: 'Morgan Housel timeless money lessons', price: 399, category: 'Books', image: 'https://bookstech.in/products/the-psychology-of-money-morgan-housel?srsltid=AfmBOoow_iTcXWzhQA-Tnk6gmGbWZKr38P5nLmiaUsUdmTfq9FH40u7V', stock: 80 },
  // BEAUTY
  { name: "L'Oreal Face Serum", description: 'Anti aging vitamin C brightening serum', price: 899, category: 'Beauty', image: 'https://media6.ppl-media.com/tr:h-750,w-750,c-at_max,dpr-2,q-40,f-avif/static/img/product/388426/l-oreal-paris-glycolic-bright-skin-brightening-serum-30ml-1-percentage-glycolic-acid-serum-for-dark-spots-pigmentation-and-uneven-skin-tone-14-89-19_1_display_1747915632_ca696c71.jpg', stock: 50 },
  { name: 'Maybelline Lipstick', description: 'Long lasting matte finish lipstick', price: 499, category: 'Beauty', image: 'https://www.newu.in/cdn/shop/products/1_153747b6-95de-4a21-ab89-6d438f2e6bd8_1024x1024.jpg?v=1737721473', stock: 70 },
  { name: 'MAC Foundation', description: 'Full coverage liquid foundation all skin types', price: 2850, category: 'Beauty', image: 'https://i5.walmartimages.com/asr/475280fd-8d14-4df1-8346-99d0810e0a9e.0d523f7a391bcd0191923d4a10e06ce0.jpeg', stock: 40 },
  { name: 'Lakme Eyeshadow Palette', description: '9 shade eyeshadow palette blend easily', price: 699, category: 'Beauty', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80', stock: 55 },
  { name: 'Biotique Face Wash', description: 'Natural herbal face wash for glowing skin', price: 199, category: 'Beauty', image: 'https://m.media-amazon.com/images/I/61pRkRs9OQL.jpg', stock: 80 },
  { name: 'Nykaa Perfume Collection', description: 'Luxury long lasting fragrance gift set', price: 1499, category: 'Beauty', image: 'https://m.media-amazon.com/images/I/31710dGvOwL._AC_UF1000,1000_QL80_.jpg', stock: 35 },
  { name: 'Himalaya Face Cream', description: 'Nourishing moisturizer for all skin types', price: 299, category: 'Beauty', image: 'https://images-static.nykaa.com/media/catalog/product/6/a/6a9866c8901138504519.jpg', stock: 90 },
  { name: 'Dove Body Lotion', description: 'Deep moisture body lotion 24hr hydration', price: 399, category: 'Beauty', image: 'https://m.media-amazon.com/images/I/51XiGT7b-dL.jpg', stock: 75 },
  // SPORTS
  { name: 'Yoga Mat Premium 6mm', description: 'Non-slip extra thick exercise yoga mat', price: 1299, category: 'Sports', image: 'https://lirp.cdn-website.com/md/dmtmpl/20438d1a-d8a9-40db-a0e0-8a1ad14378fd/dms3rep/multi/opt/yoga_mat_black-640w.jpg', stock: 30 },
  { name: 'Adjustable Dumbbell Set', description: 'Rubber coated weight dumbbell pair 20kg', price: 4999, category: 'Sports', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80', stock: 20 },
  { name: 'Resistance Bands Set', description: 'Set of 5 resistance bands for workout', price: 799, category: 'Sports', image: 'https://contents.mediadecathlon.com/p2743201/45f245b00da82af0bfedda4b6c39704c/p2743201.jpg', stock: 60 },
  { name: 'Skipping Rope', description: 'Speed jump rope with ball bearings', price: 499, category: 'Sports', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD2DVOdhRZdrCiOqOpbQb2hiMqLpbD6y3X5g&s', stock: 80 },
  { name: 'Cricket Bat Kashmir Willow', description: 'Full size cricket bat for adults', price: 1999, category: 'Sports', image: 'https://prokicksports.com/cdn/shop/files/SG-SCORER-KWBAT_1.jpg?v=1738561776&width=1445', stock: 25 },
  { name: 'Football Nike Strike', description: 'Match quality football size 5', price: 2499, category: 'Sports', image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80', stock: 30 },
  { name: 'Badminton Racket Set', description: 'Set of 2 badminton rackets with shuttles', price: 1499, category: 'Sports', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80', stock: 35 },
  { name: 'Gym Gloves', description: 'Anti slip weight lifting gym gloves', price: 699, category: 'Sports', image: 'https://strausssport.com/cdn/shop/files/71zKWjbkuyL.jpg?v=1738729805', stock: 50 },
  { name: 'Water Bottle 1L', description: 'Stainless steel insulated water bottle', price: 999, category: 'Sports', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80', stock: 70 },
  { name: 'Protein Powder Whey', description: 'Whey protein 1kg chocolate flavor', price: 2499, category: 'Sports', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZFUKbqCNY_iLnvv-RbeC-TUgH85VaavMxdw&s', stock: 40 },
  // HOME
  { name: 'Coffee Maker 12 Cup', description: '12 cup programmable drip coffee maker', price: 3499, category: 'Home', image: 'https://m.media-amazon.com/images/I/71ASFjKIPiL.jpg', stock: 25 },
  { name: 'Instant Pot 6L', description: '7 in 1 electric pressure cooker', price: 8999, category: 'Home', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCY74m-WtwjraAyml0Xyqll9sO4F_5jvmt1w&s', stock: 20 },
  { name: 'Air Fryer 5.5L', description: 'Digital air fryer with 8 preset modes', price: 4999, category: 'Home', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhPeepoN_Owg1AhvE-H_ckFjCRRI5sPVofuA&s', stock: 18 },
  { name: 'Philips Air Purifier', description: 'HEPA air purifier for large rooms', price: 14999, category: 'Home', image: 'https://images.jdmagicbox.com/quickquotes/images_main/ttcl-air-purifiers-26-03-2020-mp000000003892984-184491654-6m9w0io1.jpg', stock: 15 },
  { name: 'Dyson V12 Vacuum', description: 'Cordless stick vacuum cleaner powerful', price: 49900, category: 'Home', image: 'https://m.media-amazon.com/images/I/51sN+rg4EiL.jpg', stock: 10 },
  { name: 'Mixer Grinder 750W', description: 'Powerful mixer grinder 3 jars stainless', price: 2999, category: 'Home', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0cg34BITSybeVsyK7-2ybAAVkNDeW57fSCw&s', stock: 30 },
  { name: 'Non Stick Cookware Set', description: '5 piece non stick cooking pan set', price: 2499, category: 'Home', image: 'https://5.imimg.com/data5/SELLER/Default/2024/4/411477143/EM/MJ/JF/92037128/nonstick-cookware-set.jpg', stock: 25 },
  { name: 'Electric Kettle 1.5L', description: 'Fast boiling stainless steel electric kettle', price: 1299, category: 'Home', image: 'https://m.media-amazon.com/images/I/51DGcy8eBCL.jpg', stock: 40 },
  { name: 'Bed Sheet King Size', description: '100% cotton 400TC king size bed sheet set', price: 1999, category: 'Home', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80', stock: 35 },
  { name: 'Scented Candle Set', description: 'Luxury aromatherapy scented candle gift set', price: 1499, category: 'Home', image: 'https://m.media-amazon.com/images/I/91NA+x6Nn4L.jpg', stock: 45 },
  { name: 'Wall Clock Modern', description: 'Silent sweep modern decorative wall clock', price: 1299, category: 'Home', image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&q=80', stock: 30 },
  { name: 'Bamboo Cutting Board', description: 'Large bamboo cutting board with groove', price: 899, category: 'Home', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_3ppeM7tOD8JDb09XhkBzwjJDHfQhyliw4g&s', stock: 50 },
];

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('products');
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', image: '', stock: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    if (!user?.isAdmin) navigate('/');
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = () => api.get('/products').then(r => setProducts(r.data));
  const fetchOrders = () => api.get('/orders/all').then(r => setOrders(r.data));

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddProduct = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/products', { ...form, price: Number(form.price), stock: Number(form.stock) });
      setMsg('✅ Product added!');
      setForm({ name: '', description: '', price: '', category: '', image: '', stock: '' });
      fetchProducts();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Error'));
    }
    setLoading(false);
  };

  const handleSeedProducts = async () => {
    setSeeding(true);
    setMsg('');
    let count = 0;
    for (const p of SAMPLE_PRODUCTS) {
      try {
        await api.post('/products', p);
        count++;
        setMsg('⏳ Adding products... ' + count + '/' + SAMPLE_PRODUCTS.length);
      } catch (e) {
        console.log('Error adding:', p.name);
      }
    }
    setMsg('✅ Successfully added ' + count + ' products!');
    fetchProducts();
    setSeeding(false);
  };

  const handleDeleteProduct = async id => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  const handleDeleteAllProducts = async () => {
    if (!window.confirm('Delete ALL products?')) return;
    for (const p of products) {
      try { await api.delete('/products/' + p._id); } catch (e) {}
    }
    fetchProducts();
    setMsg('✅ All products deleted!');
  };

  const handleStatusUpdate = async (id, status) => {
    await api.put('/orders/' + id + '/status', { status });
    fetchOrders();
  };

  const statusColor = s => ({
    pending: '#ff9800', processing: '#2196f3',
    shipped: '#9c27b0', delivered: '#4caf50', cancelled: '#f44336'
  }[s] || '#888');

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>⚙️ Admin Panel</h2>
        <div style={styles.stats}>
          <div style={styles.stat}><span style={styles.statNum}>{products.length}</span><span style={styles.statLabel}>Products</span></div>
          <div style={styles.stat}><span style={styles.statNum}>{orders.length}</span><span style={styles.statLabel}>Orders</span></div>
          <div style={styles.stat}><span style={styles.statNum}>₹{orders.reduce((s, o) => s + o.totalPrice, 0).toFixed(0)}</span><span style={styles.statLabel}>Revenue</span></div>
        </div>
      </div>

      <div style={styles.tabs}>
        {['products', 'orders', 'add'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={tab === t ? styles.activeTab : styles.tab}>
            {t === 'products' ? '📦 Products' : t === 'orders' ? '📋 Orders' : '➕ Add Product'}
          </button>
        ))}
      </div>

      {tab === 'add' && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3>Add New Product</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleDeleteAllProducts} style={styles.deleteAllBtn}>🗑 Delete All</button>
              <button onClick={handleSeedProducts} disabled={seeding} style={styles.seedBtn}>
                {seeding ? '⏳ Adding...' : '🚀 Add 100 Products'}
              </button>
            </div>
          </div>
          {msg && <p style={styles.msg}>{msg}</p>}
          <form onSubmit={handleAddProduct} style={styles.form}>
            <div style={styles.formGrid}>
              {[
                { name: 'name', placeholder: 'Product Name' },
                { name: 'price', placeholder: 'Price in ₹ (e.g. 999)' },
                { name: 'category', placeholder: 'Category (Electronics, Shoes etc)' },
                { name: 'stock', placeholder: 'Stock quantity' },
              ].map(f => (
                <input key={f.name} name={f.name} placeholder={f.placeholder}
                  value={form[f.name]} onChange={handleChange} style={styles.input} required />
              ))}
            </div>
            <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} style={styles.inputFull} />
            <textarea name="description" placeholder="Product description" value={form.description}
              onChange={handleChange} style={styles.textarea} required />
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Adding...' : '➕ Add Product'}
            </button>
          </form>
        </div>
      )}

      {tab === 'products' && (
        <div style={styles.section}>
          <h3>All Products ({products.length})</h3>
          <div style={styles.productTable}>
            {products.map(p => (
              <div key={p._id} style={styles.productRow}>
                <img src={p.image} alt={p.name} style={styles.thumb}
                  onError={e => { e.target.src = 'https://via.placeholder.com/60'; }} />
                <div style={{ flex: 1 }}>
                  <p style={styles.productName}>{p.name}</p>
                  <p style={styles.productCat}>{p.category}</p>
                </div>
                <span style={styles.productPrice}>₹{p.price}</span>
                <span style={styles.stockBadge(p.stock)}>Stock: {p.stock}</span>
                <button onClick={() => handleDeleteProduct(p._id)} style={styles.delBtn}>🗑 Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div style={styles.section}>
          <h3>All Orders ({orders.length})</h3>
          {orders.map(o => (
            <div key={o._id} style={styles.orderRow}>
              <div>
                <p style={styles.orderId}>#{o._id.slice(-8)}</p>
                <p style={styles.orderUser}>{o.user?.name || 'Customer'} — {o.user?.email}</p>
                <p style={styles.orderItems}>{o.items.map(i => i.name + ' x' + i.quantity).join(', ')}</p>
              </div>
              <div style={styles.orderRight}>
                <p style={styles.orderTotal}>₹{o.totalPrice.toFixed(2)}</p>
                <p style={styles.orderDate}>{new Date(o.createdAt).toLocaleDateString()}</p>
                <select
                  value={o.status}
                  onChange={e => handleStatusUpdate(o._id, e.target.value)}
                  style={{ ...styles.statusSelect, borderColor: statusColor(o.status), color: statusColor(o.status) }}
                >
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { padding: '24px', background: '#f3f3f3', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
  title: { margin: 0, fontSize: '28px' },
  stats: { display: 'flex', gap: '16px' },
  stat: { background: '#fff', padding: '12px 20px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  statNum: { display: 'block', fontSize: '24px', fontWeight: 'bold', color: '#e94560' },
  statLabel: { fontSize: '12px', color: '#888' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '20px' },
  tab: { padding: '10px 20px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  activeTab: { padding: '10px 20px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  section: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' },
  seedBtn: { padding: '10px 20px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  deleteAllBtn: { padding: '10px 20px', background: '#f44336', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  msg: { padding: '10px 16px', background: '#f0f9f0', borderRadius: '8px', color: '#2e7d32', marginBottom: '16px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' },
  inputFull: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', width: '100%', boxSizing: 'border-box' },
  textarea: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', minHeight: '80px', resize: 'vertical' },
  submitBtn: { padding: '12px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' },
  productTable: { display: 'flex', flexDirection: 'column', gap: '10px' },
  productRow: { display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', border: '1px solid #f0f0f0', borderRadius: '8px', background: '#fafafa' },
  thumb: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' },
  productName: { margin: 0, fontWeight: '600', fontSize: '15px' },
  productCat: { margin: 0, color: '#888', fontSize: '12px' },
  productPrice: { fontWeight: 'bold', color: '#e94560', minWidth: '80px' },
  stockBadge: s => ({ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', background: s > 10 ? '#e8f5e9' : s > 0 ? '#fff3e0' : '#ffebee', color: s > 10 ? '#2e7d32' : s > 0 ? '#e65100' : '#c62828' }),
  delBtn: { padding: '6px 12px', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  orderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '16px', border: '1px solid #f0f0f0', borderRadius: '8px', marginBottom: '10px', background: '#fafafa', flexWrap: 'wrap', gap: '12px' },
  orderId: { margin: '0 0 4px', fontWeight: 'bold', fontFamily: 'monospace' },
  orderUser: { margin: '0 0 4px', color: '#555', fontSize: '13px' },
  orderItems: { margin: 0, color: '#888', fontSize: '12px' },
  orderRight: { textAlign: 'right' },
  orderTotal: { margin: '0 0 4px', fontWeight: 'bold', color: '#e94560', fontSize: '18px' },
  orderDate: { margin: '0 0 8px', color: '#888', fontSize: '12px' },
  statusSelect: { padding: '6px 12px', borderRadius: '6px', border: '2px solid', fontWeight: 'bold', cursor: 'pointer', background: '#fff' },
};

export default Admin;