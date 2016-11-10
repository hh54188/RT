# 开发日志 & 设计思想

## Single Source of Truth (SSOT)

[https://en.wikipedia.org/wiki/Single_source_of_truth](https://en.wikipedia.org/wiki/Single_source_of_truth):

>In information systems design and theory, single source of truth (SSOT), also known as single point of truth (SPOT), is the practice of structuring information models and associated schemata such that **every data element is stored exactly once** (e.g., in no more than a single row of a single table). Any possible linkages to this data element (possibly in other areas of the relational schema or even in distant federated databases) **are by reference only**. Because all other locations of the data just refer back to the primary "source of truth" location, updates to the data element in the primary location propagate to the entire system without the possibility of a duplicate value somewhere being forgotten.

这个原则说的是，数据应该有且只有一份，一条信息只能在一张表中存储一行/一次，其他对数据的使用都是对数据的引用。这样一来使用方对数据进行更改之后，更改的其实是唯一真实的那份数据，并且这种更改能够传播到所有引用该数据的地方。

反过来，如果数据有多个副本，存在不同的数据库中，那么当其中一份更新之后，而有来不及同步的话，不同地方的人看到数据可能会不同。已经冗余的数据，或者已经不能反映真实情况的数据，我们称之为 stale data

### 方法一

那么采用什么技术保证SSOT呢？比如说ESB (Enterprise service bus)

至于什么是ESB，有机会再谈，这里先体会一下：

>An enterprise service bus (ESB) allows any number of systems in an organisation to receive updates of data that has changed in another system. 
To implement a Single Source of Truth, a single source system of correct data for any entity must be identified. Changes to this entity (creates, updates, and deletes) are then published via the ESB; other systems which need to retain a copy of that data subscribe to this update, and update their own records accordingly. For any given entity, the master source must be identified (sometimes called the Golden Record). It should be noted that any given system could publish (be the source of truth for) information on a particular entity (e.g., customer) and also subscribe to updates from another system for information on some other entity (e.g., product).

ESB允许来自同一个组织内的系统互相接受来自其他系统的更新。首先存放唯一数据的系统必须要亮明身份，对数据的更改可以通过ESB发布出去，其他系统通过订阅获取到最新数据的副本，然后根据副本再次更新。

### 方法二

[http://softwareengineering.stackexchange.com/questions/288279/single-source-of-truth-within-an-enterprise-distributed-system](http://softwareengineering.stackexchange.com/questions/288279/single-source-of-truth-within-an-enterprise-distributed-system)

使用 microservice 思想，

另外创建一个类似于读写数据的服务，独立于当前系统，所有的修改都通过这个独立服务进行，包括对数据的校验



