-- 기존 테이블의 컬럼명 변경 (만약 테이블이 이미 존재한다면)
ALTER TABLE packages RENAME COLUMN "departureDate" TO departuredate;
ALTER TABLE packages RENAME COLUMN "discountPrice" TO discountprice;
ALTER TABLE packages RENAME COLUMN "reviewCount" TO reviewcount;
ALTER TABLE packages RENAME COLUMN "isFeatured" TO isfeatured;
ALTER TABLE packages RENAME COLUMN "isOnSale" TO isonsale;
