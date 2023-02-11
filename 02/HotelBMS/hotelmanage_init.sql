create database hotelmanage;
use hotelmanage;

CREATE TABLE `vip`
(
    `vid`      int         NOT NULL AUTO_INCREMENT,
    `vip`      varchar(30) NOT NULL,
    `discount` int         NOT NULL DEFAULT '0',
    PRIMARY KEY (`vid`)
);
CREATE TABLE `customer`
(
    `cid`      int          NOT NULL AUTO_INCREMENT,
    `identity` varchar(255) NOT NULL,
    `cname`    varchar(255) NOT NULL,
    `csex`     int          NOT NULL,
    `vid`      int          NOT NULL,
    `phone`    varchar(255) DEFAULT NULL,
    `email`    varchar(255) DEFAULT NULL,
    `checkin`  int          DEFAULT '0',
    PRIMARY KEY (`cid`),
    KEY `fk_customer_vip` (`vid`),
    CONSTRAINT `fk_customer_vip` FOREIGN KEY (`vid`) REFERENCES `vip` (`vid`)
);
CREATE TABLE `staff_type`
(
    `stno`     int NOT NULL AUTO_INCREMENT,
    `typename` varchar(255) DEFAULT NULL,
    `salary`   int          DEFAULT NULL,
    PRIMARY KEY (`stno`)
);
CREATE TABLE `staff`
(
    `sno`      int          NOT NULL AUTO_INCREMENT,
    `sname`    varchar(255) NOT NULL,
    `ssex`     tinyint      NOT NULL,
    `sphone`   varchar(255) DEFAULT NULL,
    `stype`    int          NOT NULL,
    `saccount` varchar(255) NOT NULL,
    `spwd`     varchar(255) NOT NULL,
    PRIMARY KEY (`sno`),
    KEY `fk_staff_type` (`stype`),
    CONSTRAINT `fk_staff_type` FOREIGN KEY (`stype`) REFERENCES `staff_type` (`stno`)
);
CREATE TABLE `room_type`
(
    `rid`    int NOT NULL AUTO_INCREMENT,
    `rtype`  varchar(255) DEFAULT NULL,
    `rprice` int NOT NULL,
    PRIMARY KEY (`rid`)
);
CREATE TABLE `room`
(
    `rno`     int        NOT NULL AUTO_INCREMENT,
    `rnumber` int                 DEFAULT NULL,
    `rphone`  varchar(255)        DEFAULT NULL,
    `used`    tinyint(1) NOT NULL DEFAULT '0',
    `rtypeid` int        NOT NULL,
    PRIMARY KEY (`rno`),
    KEY `fk_room_type` (`rtypeid`),
    CONSTRAINT `fk_room_type` FOREIGN KEY (`rtypeid`) REFERENCES `room_type` (`rid`)
);
CREATE TABLE `manager`
(
    `mno`      int          NOT NULL AUTO_INCREMENT,
    `mname`    varchar(255) NOT NULL,
    `maccount` varchar(255) DEFAULT NULL,
    `mpwd`     varchar(255) NOT NULL,
    PRIMARY KEY (`mno`)
);
CREATE TABLE `movein`
(
    `in_no`       int      NOT NULL AUTO_INCREMENT,
    `c_id`        int      NOT NULL,
    `r_id`        int      NOT NULL,
    `moveintime`  datetime NOT NULL,
    `moveouttime` datetime NOT NULL,
    `s_id`        int DEFAULT NULL,
    `ishistory`   int DEFAULT '0',
    PRIMARY KEY (`in_no`),
    KEY `fk_movein_c` (`c_id`),
    KEY `fk_movein_r` (`r_id`),
    CONSTRAINT `fk_movein_c` FOREIGN KEY (`c_id`) REFERENCES `customer` (`cid`),
    CONSTRAINT `fk_movein_r` FOREIGN KEY (`r_id`) REFERENCES `room` (`rno`)
);
CREATE TABLE `moveout`
(
    `out_no`      int      NOT NULL AUTO_INCREMENT,
    `c_id`        int      NOT NULL,
    `r_id`        int      NOT NULL,
    `moveintime`  datetime DEFAULT NULL,
    `moveouttime` datetime NOT NULL,
    `fine`        int      NOT NULL,
    `s_id`        int      DEFAULT NULL,
    `ishistory`   int      DEFAULT '0',
    PRIMARY KEY (`out_no`),
    KEY `fk_moveout_c` (`c_id`),
    KEY `fk_moveout_r` (`r_id`),
    CONSTRAINT `fk_moveout_c` FOREIGN KEY (`c_id`) REFERENCES `customer` (`cid`),
    CONSTRAINT `fk_moveout_r` FOREIGN KEY (`r_id`) REFERENCES `room` (`rno`)
);
CREATE TABLE `reserve`
(
    `r_no`        int      NOT NULL AUTO_INCREMENT,
    `c_id`        int      NOT NULL,
    `r_id`        int      NOT NULL,
    `moveintime`  datetime NOT NULL,
    `moveouttime` datetime NOT NULL,
    `s_id`        int DEFAULT NULL,
    `ishistory`   int DEFAULT '0',
    PRIMARY KEY (`r_no`),
    KEY `fk_reserve_c` (`c_id`),
    KEY `fk_reserve_r` (`r_id`),
    CONSTRAINT `fk_reserve_c` FOREIGN KEY (`c_id`) REFERENCES `customer` (`cid`),
    CONSTRAINT `fk_reserve_r` FOREIGN KEY (`r_id`) REFERENCES `room` (`rno`)
);
CREATE TABLE `bill`
(
    `bno`    int NOT NULL AUTO_INCREMENT,
    `out_no` int NOT NULL,
    `sum`    int NOT NULL,
    PRIMARY KEY (`bno`),
    KEY `fk_bill_moveout` (`out_no`),
    CONSTRAINT `fk_bill_moveout` FOREIGN KEY (`out_no`) REFERENCES `moveout` (`out_no`)
);
CREATE TABLE `handling`
(
    `handlingno`     int      NOT NULL AUTO_INCREMENT,
    `handlingtype`   int      NOT NULL,
    `handingtype_id` int      NOT NULL,
    `handlingtime`   datetime NOT NULL,
    PRIMARY KEY (`handlingno`)
);


# 数据 ----------------------------------------------------------------------------------------------------
INSERT INTO `vip`
VALUES (1, 'N', 100),
       (2, 'VIP', 90),
       (3, 'SVIP', 70),
       (4, 'SSVIP', 50),
       (7, '测试类型', 120);

INSERT INTO `staff_type`
VALUES (1, '一级员工', 4500),
       (2, '二级员工', 8000),
       (3, '三级员工', 12000),
       (4, '四级员工', 20000);

INSERT INTO `room_type`
VALUES (1, '一级房间', 100),
       (2, '二级房间', 250),
       (3, '三级房间', 400);

INSERT INTO `customer`
VALUES (1, '20030101', '龙笑愚', 0, 1, '15767137557', 'rupert.orn@gmail.com', 0),
       (2, '20030102', '郑昊然', 1, 2, '14541976276', 'devin.damore@hotmail.com', 1),
       (3, '20030103', '毛潇然', 0, 1, '17146354626', 'beverly.kohler@gmail.com', 1),
       (4, '20030104', '蔡智宸', 0, 3, '17137048051', 'whitney.weimann@gmail.com', 1),
       (5, '20030105', '黄锦程', 0, 1, '17329102387', 'seymour.kuhn@gmail.com', 0),
       (6, '20030106', '尹泽洋', 1, 2, '15921515094', 'brad.schaden@gmail.com', 0),
       (7, '20030107', '贺航', 1, 1, '13299735702', 'ferdinand.tromp@yahoo.com', 0),
       (8, '20030108', '段天翊', 0, 2, '15116285143', 'joselyn.littel@gmail.com', 0),
       (9, '20030109', '贾乐驹', 1, 1, '17317292836', 'wilber.bernhard@yahoo.com', 0),
       (10, '20030111', '董修洁', 0, 1, '13718789743', 'rosanna.marks@gmail.com', 0),
       (11, '330333223303033333', '吴大维', 1, 3, '13131313131', '13131313131@qq.com', 0),
       (15, '430426200201011312', '测试人员1', 0, 4, '19813634861', '', 0),
       (16, '330326200305182312', '测试人员2', 0, 2, '19866666666', '', 1);

INSERT INTO `staff`
VALUES (1, '方天翊', 1, '13456782311', 1, 'xiaoming', '123456'),
       (2, '吴梓晨', 0, '19313135342', 2, '2jA', 'zTw'),
       (3, '赵雨泽', 0, '13144324244', 1, '2uO', 'iY'),
       (4, '莫彬', 0, '15324242456', 3, 'apCQ', '7cKd'),
       (5, '张三', 0, '13792514285', 3, 'zhangsan', '8888'),
       (37, '李四111', 0, '13867994343', 1, 'GQQux', 'igzU7'),
       (41, '赵六', 0, '13131313131', 3, 'gdj', 'gdj'),
       (42, '微软', 0, '13131313131', 2, '1234', 'BMU17'),
       (43, '司机', 0, '13131313131', 4, '1313', '2');

INSERT INTO `room`
VALUES (1, 101, '13131313131', 1, 1),
       (2, 102, '13131313132', 1, 1),
       (3, 103, '13131313133', 1, 1),
       (4, 104, '13131313134', 1, 2),
       (5, 105, '13131313135', 0, 1),
       (6, 201, '13131313136', 0, 2),
       (7, 202, '13131313137', 0, 1),
       (8, 203, '13131313138', 0, 1),
       (9, 204, '13131313139', 0, 3);

INSERT INTO `manager`
VALUES (1, '小王', 'xiaowang', '1234'),
       (2, '小张', 'NFEAV', 'UJLgl'),
       (3, '小陈', 'Zv', 'nHv');


INSERT INTO `reserve`
VALUES (19, 15, 9, '2022-12-24 08:00:00', '2022-12-27 12:00:00', 1, 1),
       (20, 16, 2, '2022-12-23 08:00:00', '2022-12-30 12:00:00', 1, 1),
       (21, 17, 6, '2022-12-23 08:00:00', '2022-12-30 12:00:00', 1, 1),
       (22, 4, 3, '2022-12-07 08:00:00', '2022-12-24 12:00:00', 1, 1);

INSERT INTO `movein`
VALUES (46, 1, 9, '2022-12-15 16:34:04', '2022-12-16 12:00:00', 1, 1),
       (47, 1, 1, '2022-12-18 18:24:56', '2022-12-22 12:00:00', 1, 1),
       (48, 2, 4, '2022-12-18 18:25:24', '2022-12-30 12:00:00', 1, 0),
       (49, 15, 9, '2022-12-22 22:26:15', '2022-12-27 12:00:00', 1, 1),
       (50, 16, 2, '2022-12-22 23:36:45', '2022-12-30 12:00:00', 1, 0),
       (51, 17, 6, '2022-12-22 23:43:06', '2022-12-30 12:00:00', 1, 1),
       (52, 3, 1, '2022-12-23 08:58:59', '2022-12-23 12:00:00', 1, 0),
       (53, 4, 3, '2022-12-23 09:01:33', '2022-12-24 12:00:00', 1, 0),
       (54, 5, 5, '2022-12-23 09:44:32', '2022-12-24 12:00:00', 1, 1);

INSERT INTO `moveout`
VALUES (35, 1, 9, '2022-12-15 16:34:04', '2022-12-18 16:43:14', 10, 1, 1),
       (36, 15, 9, '2022-12-22 22:26:15', '2022-12-22 22:26:40', 0, 1, 1),
       (37, 17, 6, '2022-12-22 23:43:06', '2022-12-22 23:43:26', 0, 1, 1),
       (38, 1, 1, '2022-12-18 18:24:56', '2022-12-22 23:44:12', 0, 1, 1),
       (39, 5, 5, '2022-12-23 09:44:32', '2022-12-23 09:44:54', 0, 1, 0);

INSERT INTO `bill`
VALUES (7, 35, 1320),
       (8, 36, 0),
       (9, 37, 0),
       (10, 38, 400);

INSERT INTO `handling`
VALUES (45, 3, 35, '2022-12-18 16:43:14'),
       (46, 1, 47, '2022-12-18 18:24:56'),
       (47, 1, 48, '2022-12-18 18:25:24'),
       (48, 2, 19, '2022-12-22 22:25:49'),
       (49, 1, 49, '2022-12-22 22:26:15'),
       (50, 3, 36, '2022-12-22 22:26:40'),
       (51, 2, 20, '2022-12-22 23:36:12'),
       (52, 1, 50, '2022-12-22 23:36:45'),
       (53, 2, 21, '2022-12-22 23:42:20'),
       (54, 1, 51, '2022-12-22 23:43:06'),
       (55, 3, 37, '2022-12-22 23:43:26'),
       (56, 3, 38, '2022-12-22 23:44:12'),
       (57, 1, 52, '2022-12-23 08:58:59'),
       (58, 2, 22, '2022-12-23 08:59:07'),
       (59, 1, 53, '2022-12-23 09:01:33'),
       (60, 1, 54, '2022-12-23 09:44:32'),
       (61, 3, 39, '2022-12-23 09:44:54');



-- 外键部分 ----------
# 员工和员工类型
alter table staff
    add constraint fk_staff_type foreign key (stype) references staff_type (stno);
# 客户和客户类型
alter table hotelmanage.customer
    add constraint fk_customer_vip foreign key (vid) references vip (vid);

# 房间和房间类型
alter table hotelmanage.room
    add constraint fk_room_type foreign key (rtypeid) references room_type (rid);

#退房到账单绑定
alter table bill
    add constraint fk_bill_moveout foreign key (out_no) references moveout (out_no);

#入住绑定客户，房间
alter table movein
    add constraint fk_movein_c foreign key (c_id) references customer (cid);
alter table movein
    add constraint fk_movein_r foreign key (r_id) references room (rno);

#预定绑定客户，房间
alter table reserve
    add constraint fk_reserve_c foreign key (c_id) references customer (cid);
alter table reserve
    add constraint fk_reserve_r foreign key (r_id) references room (rno);

#退房绑定客户，房间
alter table moveout
    add constraint fk_moveout_c foreign key (c_id) references customer (cid);
alter table moveout
    add constraint fk_moveout_r foreign key (r_id) references room (rno);



-- 视图部分---------------------------------------------------------------------------------------------------------------------
# 1.房间视图
create view room_type_v as
select room.rno,
       room.rnumber,
       room.rphone,
       room_type.rtype,
       room_type.rprice,
       room.used
from room,
     room_type
where room.rtypeid = room_type.rid;



# 2.员工和员工类型展示视图
create view staff_toshow as
select sno,
       sname,
       ssex,
       sphone,
       typename,
       salary,
       saccount,
       spwd
from staff
         join staff_type
where stype = stno;



# 3.客户视图
# drop view if exists customer_vip_v;
create view customer_vip_v as
select cid,
       identity,
       cname,
       csex,
       phone,
       email,
       vip,
       discount,
       checkin
from hotelmanage.customer
         join hotelmanage.vip v on customer.vid = v.vid;


# 4.两个用户可修改信息的视图
create view staff_user as
select sno      id,
       sname    name,
       saccount account,
       spwd     pwd
from staff;

create view manager_user as
select mno      id,
       mname    name,
       maccount account,
       mpwd     pwd
from manager;

# 5.入住记录查询信息视图
# drop view movein_info_v;
create view movein_info_v as
select in_no id,
       cname name,
       rnumber,
       moveintime,
       moveouttime,
       ishistory
from movein,
     customer,
     room_type_v
where c_id = customer.cid
  and r_id = room_type_v.rno;


# 6.预定记录查询信息视图
# drop view reserve_info_v;
create view reserve_info_v as
select r_no  id,
       cname name,
       rnumber,
       moveintime,
       moveouttime,
       ishistory
from reserve,
     customer,
     room_type_v
where c_id = customer.cid
  and r_id = room_type_v.rno;


#7.退房信息视图
create view moveout_info_v as
select out_no id,
       cname  name,
       rnumber,
       moveintime,
       moveouttime,
       fine,
       ishistory
from moveout,
     customer,
     room_type_v
where c_id = customer.cid
  and r_id = room_type_v.rno;


#8.handling视图
# drop view handling_info_v;
create view handling_info_v as
select h.handlingno id,
       case h.handlingtype
           when 1 then '入住'
           when 2 then '预定'
           when 3 then '退房'
           end as   handlingtype,
       c.cname,
       r.rnumber,
       s.sname,
       h.handlingtime
from handling h
         left join movein h1 on h.handingtype_id = h1.in_no and h.handlingtype = 1
         left join reserve h2 on h.handingtype_id = h2.r_no and h.handlingtype = 2
         left join moveout h3 on h.handingtype_id = h3.out_no and h.handlingtype = 3
         left join customer c on c.cid =
                                 case h.handlingtype
                                     when 1 then h1.c_id
                                     when 2 then h2.c_id
                                     when 3 then h3.c_id
                                     end
         left join room r on r.rno =
                             case h.handlingtype
                                 when 1 then h1.r_id
                                 when 2 then h2.r_id
                                 when 3 then h3.r_id
                                 end
         left join staff s on s.sno =
                              case h.handlingtype
                                  when 1 then h1.s_id
                                  when 2 then h2.s_id
                                  when 3 then h3.s_id
                                  end;


#9.账单视图
create view bill_info_v as
select bno id,
       name,
       rnumber,
       sum,
       handlingtime
from bill
         join moveout_info_v miv on miv.id = out_no
         join handling hg on handingtype_id = miv.id;


-- 触发器部分 ----------------------------------------------------------------------------------


# 1.触发器之insert入住
# drop trigger c_movein_t;
create trigger c_movein_t
    after insert
    on movein
    for each row
begin
    declare rifused int default 0;
    declare cifchecked int default 0;
    declare r_id int;
    declare c_id int;
    select new.r_id into r_id;
    select new.c_id into c_id;
    if (@disable_trigger = 0) then
        select used from room where rno = r_id into rifused;
        if (rifused = 1) then
            signal sqlstate 'hy000' set message_text = '房间已入住或预定，不可重复入住';
        end if;
        select checkin from customer where cid = c_id into cifchecked;
        if (cifchecked = 1) then
            signal sqlstate 'hy000' set message_text = '客户已入住，不可重复入住';
        end if;
    end if;
    update room set used=1 where rno = r_id;
    update customer set checkin=1 where hotelmanage.customer.cid = c_id;

    # 插入handing
    insert into handling values (null, 1, new.in_no, now());
end;
# insert into handling
# values (null, 1, 1, 1, now());
# insert into movein
# values (null, 2, 8, '2022-12-11 23:53:42', '2022-12-12 23:53:42');


#2.触发器之insert预定
# drop trigger c_reserve_t;
set @disable_trigger = 0;
create trigger c_reserve_t
    after insert
    on reserve
    for each row
begin
    declare rifused int default 0;
    declare cifchecked int default 0;
    declare r_id int;
    declare c_id int;
    select new.r_id into r_id;
    select new.c_id into c_id;
    if (@disable_trigger = 0) then
        select used from room where rno = r_id into rifused;
        if (rifused = 1) then
            signal sqlstate 'hy000' set message_text = '房间已入住或预定，不可预定';
        end if;
        select checkin from customer where cid = c_id into cifchecked;
        if (cifchecked = 1) then
            signal sqlstate 'hy000' set message_text = '客户已入住，不可预定';
        end if;
    end if;
    update room set used=1 where rno = r_id;
    update customer set checkin=1 where hotelmanage.customer.cid = c_id;
    insert into handling values (null, 2, new.r_no, now());
end;



# 2.5触发器之insert退房
create trigger c_moveout_t
    after insert
    on moveout
    for each row
begin
    update room set used = 0 where rno = new.r_id;
    update customer set checkin=0 where cid = new.c_id;
    insert into handling values (null, 3, new.out_no, now());
end;



# 3.触发器之预定转入住
# drop trigger reserve_to_movein_t;
create trigger reserve_to_movein_t
    before update
    on reserve
    for each row
begin
    declare new_s_id int;
    declare old_s_id int;
    if (old.ishistory != 0) then
        signal sqlstate 'hy000' set message_text = '转为入住操作失败';
    end if;
    # 获取到当前修改用户id，还原原始用户id
    set old_s_id = old.s_id;
    set new_s_id = new.s_id;
    set new.s_id = old_s_id;
    # 插入到movein，先暂时禁止movein的检测房间和用户是否1的效果
    set @disable_trigger = 1;
    insert into movein values (null, new.c_id, new.r_id, now(), new.moveouttime, new_s_id, 0);
    set @disable_trigger = 0;
end;
#set @sqlhousing = CONCAT('insert into ',housingtable,' values (null, ',cid,', ',@erid,', "',moveintime,'", "',moveouttime,'", ',s_id,', 0 )');


# 4.触发器之预定取消
# drop trigger reserve_to_delete;
create trigger reserve_to_delete
    after delete
    on reserve
    for each row
begin
    update room set used=0 where rno = old.r_id;
    update customer set checkin=0 where cid = old.c_id;
    delete from handling where handlingtype = 2 and handingtype_id = old.r_no;
end;



#5.触发器之入住转退房
# drop trigger movein_to_moveout;
create trigger movein_to_moveout
    before update
    on movein
    for each row
begin
    declare new_s_id int;
    declare old_s_id int;
    declare overdays int default 0;
    declare fine int default 0;
    if (old.ishistory != 0) then
        signal sqlstate 'hy000' set message_text = '转为退房操作失败';
    end if;
    # 获取到当前修改用户id，还原原始用户id
    set old_s_id = old.s_id;
    set new_s_id = new.s_id;
    set new.s_id = old_s_id;
    #计算fine（实际时间-预计时间）
    set overdays = datediff(now(), new.moveouttime);
    if (overdays > 8) then
        set fine = 30;
    elseif (overdays > 5) then
        set fine = 20;
    elseif (overdays > 0) then
        set fine = 10;
    end if;
    # 插入到退房
    insert into moveout values (null, new.c_id, new.r_id, new.moveintime, now(), fine, new_s_id, 0);
end;



# 6.触发器之退房到结账
# drop trigger moveout_to_bill;
create trigger moveout_to_bill
    before update
    on moveout
    for each row
begin
    declare new_s_id int;
    declare old_s_id int;
    declare fine int default 0;
    declare sum int default 0;
    declare days int;
    declare roomprice int;
    declare discount int default 100;
    if (old.ishistory != 0) then
        signal sqlstate 'hy000' set message_text = '生成账单操作失败';
    end if;
    # 获取到当前修改用户id，还原原始用户id
    set old_s_id = old.s_id;
    set new_s_id = new.s_id;
    set new.s_id = old_s_id;
    set days = datediff(new.moveouttime, new.moveintime);
    select rprice from room_type_v where rno = new.r_id into roomprice;
    select discount from customer_vip_v where cid = new.c_id into discount;
    set sum = (roomprice * days);
    set fine = round(sum * new.fine / 100);
    set sum = round(sum * discount / 100) + fine;
    insert into bill values (null, new.out_no, sum);
end;


# 存储过程-------------------------------------------------------------------------------------------------------------


# 1.存储过程之入住和预定插入
# drop procedure housing_p;
create procedure housing_p(
    in cid int,
    in housingtype int,
    in rtypeid int,
    in moveintime varchar(64),
    in moveouttime varchar(64),
    in s_id int)
begin
    declare housingtable varchar(64);
    set @sqlhaseroom = '';
    set @sqlgeteroom = '';
    set @sqlhousing = '';
    set @sqlgethousing = '';
    set @hasroom = 0;
    set @erid = 0;
    if (housingtype = 1) then
        set housingtable = 'reserve'; # 1 预定
    elseif (housingtype = 0) then
        set housingtable = 'movein'; # 0 入住
    else
        signal sqlstate 'hy000' set message_text = '住房操作不明！';
    end if;
    set @sqlgeteroom = concat('select rno from room where rtypeid = ', rtypeid, ' and used = 0 limit 1');
    # 查询空房
    set @sqlhaseroom = concat('select exists( ', @sqlgeteroom, ' ) into @hasroom');
    prepare stmt from @sqlhaseroom;
    execute stmt;
    if (@hasroom = 0) then
        signal sqlstate 'hy000' set message_text = '此类型房间已满或不存在';
    end if;
    # 房间未满则继续
    set @sqlgeteroom = concat(@sqlgeteroom, ' into @erid');
    prepare stmt2 from @sqlgeteroom;
    execute stmt2;
    # 插入数据到对应的表
    if (moveintime != '') then
        set @sqlhousing =
                concat('insert into ', housingtable, ' values (null, ', cid, ', ', @erid, ', "', moveintime, '", "',
                       moveouttime, '", ', s_id, ', 0 )');
    else
        set @sqlhousing =
                concat('insert into ', housingtable, ' values (null, ', cid, ', ', @erid, ', "', now(), '", "',
                       moveouttime, '", ', s_id, ', 0 )');
    end if;
    prepare stmt3 from @sqlhousing;
    execute stmt3;
    # 查询插入对应表的数据并返回
    set @sqlgethousing =
            concat('select * from ', housingtable, '_info_v where name = (select cname from customer where cid = ', cid,
                   ')');
    prepare stmt4 from @sqlgethousing;
    execute stmt4;
end;
# drop procedure housing_p;
# call housing_p(7, 0, 1, '2022-12-12 23:53:42', '2022-12-12 23:53:42', 1);


# 2.对任意表单查询字段可选是否模糊查询和分页查询以及排序顺序存储过程
create procedure sel_q1_v_page(
    in tablename varchar(64),
    in queryitem varchar(64),
    in query varchar(64),
    in vague int,
    in iddesc int,
    in pagenum int,
    in pagesize int)
begin
    declare currentpage int;
    set @sqlcmd = '';
    set currentpage := (pagenum - 1) * pagesize;
    if (vague = 1) then
        set query = concat('%', query, '%');
    end if;
    set @sqlcmd = concat('select * from ', tablename, ' ');
    if query != '' then
        set @sqlcmd = concat(@sqlcmd, ' where ', queryitem, ' like "', query, '" ');
    end if;
    if (iddesc = 1) then
        set @sqlcmd = concat(@sqlcmd, ' order by id ', ' desc ');
    end if;
    set @sqlcmd = concat(@sqlcmd, ' limit ', currentpage, ', ', pagesize);
    prepare stmt from @sqlcmd;
    execute stmt;
end;
# drop procedure sel_q1_v_page;
# call sel_q1_v_page('staff_type', 'typename', '', 1, 0, 1, 4);
# call sel_q1_v_page('customer_vip_v', 'cname', '', 1, 0, 1, 4);
# call sel_q1_v_page('movein_info_v', 'ishistory', 0, 1, 4);


# 2.5.专门对具有历史记录的表单的查询（以上的衍生版）
create procedure sel_q1_v_page_housing(
    in tablename varchar(64),
    in queryitem varchar(64),
    in query varchar(64),
    in vague int,
    in iddesc int,
    in history int,
    in pagenum int,
    in pagesize int)
begin
    declare currentpage int;
    set @sqlcmd = '';
    set currentpage := (pagenum - 1) * pagesize;
    if (vague = 1) then
        set query = concat('%', query, '%');
    end if;
    set @sqlcmd = concat('select * from ', tablename, ' ', ' where 1=1 ');
    if (query != '') then
        set @sqlcmd = concat(@sqlcmd, ' and ', queryitem, ' like "', query, '" ');
    end if;
    # 0表示不看历史，只看当前ishistory=0的，1表示看历史，就是查所有
    if (history = 0) then
        set @sqlcmd = concat(@sqlcmd, ' and ishistory=0 ');
    end if;
    if (iddesc = 1) then
        set @sqlcmd = concat(@sqlcmd, ' order by id ', ' desc ');
    end if;
    set @sqlcmd = concat(@sqlcmd, ' limit ', currentpage, ', ', pagesize);
    prepare stmt from @sqlcmd;
    execute stmt;
end;
# call sel_q1_v_page_housing('movein_info_v', 'name', '', 1, 0, 1, 1, 4)


# 3. 用户认证登录后获取个人可修改信息
create procedure get_userinfo_p(
    in id int,
    in admin int)
begin
    set @sqluser = '';
    if (admin = 1) then
        set @sqluser = concat('select * from manager_user where id = ', id);
    elseif (admin = 0) then
        set @sqluser = concat('select * from staff_user where id = ', id);
    else
        signal sqlstate 'hy000' set message_text = '权限不明！';
    end if;
    prepare stmt from @sqluser;
    execute stmt;
end;
# drop procedure if exists get_userinfo_p;
# call get_userinfo_p(1, 1);


# 4.用户更新账号或密码
create procedure updata_userinfo_p(
    in id int,
    in admin int,
    in account varchar(64),
    in pwd varchar(64))
begin
    declare usertable varchar(64);
    set @hasaccount = 0;
    set @sqlfindaccount = '';
    set @sqlupdatauser = '';
    if (admin = 1) then
        set usertable = 'manager_user';
    elseif (admin = 0) then
        set usertable = 'staff_user';
    else
        signal sqlstate 'hy000' set message_text = '权限不明！';
    end if;
    if (pwd = '' and account = '') then
        signal sqlstate 'hy000' set message_text = '账号和密码不可为空！';
    end if;
    set @sqlupdatauser = concat('update ', usertable, ' set ');
    if (pwd != '') then
        set @sqlupdatauser = concat(@sqlupdatauser, ' pwd = "', pwd, '" ');
    end if;
    if (account != '') then
        set @sqlfindaccount = concat('select exists(select * from ', usertable, ' where account = "', account,
                                     '" ) into @hasaccount');
        prepare stmt from @sqlfindaccount;
        execute stmt;
        if (@hasaccount = 1) then
            signal sqlstate 'hy000' set message_text = '账号重复！';
        end if;
        if (pwd != '') then
            set @sqlupdatauser = concat(@sqlupdatauser, ' , ');
        end if;
        set @sqlupdatauser = concat(@sqlupdatauser, ' account = "', account, '" ');
    end if;
    set @sqlupdatauser = concat(@sqlupdatauser, ' where id = ', id);
    prepare stmt2 from @sqlupdatauser;
    execute stmt2;
end;
# drop procedure updata_userinfo_p;
# call updata_userinfo_p(1, 1, 'zhanghao', 'mima');















