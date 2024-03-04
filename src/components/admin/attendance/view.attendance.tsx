import { callUpdateDiemdanh } from "@/config/api";
import { IAttendance } from "@/types/backend";
import { Badge, Button, Descriptions, Drawer, Form, Select, Tag, message, notification } from "antd";
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
const { Option } = Select;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: IAttendance | null | any;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}
const ViewDetailAttendance = (props: IProps) => {
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { onClose, open, dataInit, setDataInit, reloadTable } = props;
    const [form] = Form.useForm();

    // const handleChangeStatus = async () => {
    //     setIsSubmit(true);

    //     const status = form.getFieldValue('status');
    //     const res = await callUpdateAttendance(dataInit?._id, status)
    //     if (res.data) {
    //         message.success("Update Attendance status thành công!");
    //         setDataInit(null);
    //         onClose(false);
    //         reloadTable();
    //     } else {
    //         notification.error({
    //             message: 'Có lỗi xảy ra',
    //             description: res.message
    //         });
    //     }

    //     setIsSubmit(false);
    // }

    useEffect(() => {
        if (dataInit) {
            form.setFieldValue("status", dataInit.status)
        }
        return () => form.resetFields();
    }, [dataInit])

    return (
        <>
            <Drawer
                title="Thông Tin Attendance"
                placement="right"
                onClose={() => { onClose(false); setDataInit(null) }}
                open={open}
                width={"40vw"}
                maskClosable={false}
                destroyOnClose
                // extra={
                //     <Button loading={isSubmit} type="primary" onClick={handleChangeStatus}>
                //         Change Status
                //     </Button>
                // }
            >
                <Descriptions title="" bordered column={2} layout="vertical">
                    <Descriptions.Item label="Tên Zalo">
                        {dataInit?.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Access_token">
                        {dataInit?.access_token}
                    </Descriptions.Item>
                    <Descriptions.Item label="code">
                        {dataInit?.code}
                    </Descriptions.Item>
                    <Descriptions.Item label="Thời gian tạo">{dataInit && dataInit.timestamp ? dayjs(dataInit.timestamp).format('DD-MM-YYYY HH:mm:ss') : ""}</Descriptions.Item>
                    <Descriptions.Item label="latitude">
                        {dataInit?.latitude}
                    </Descriptions.Item>
                    <Descriptions.Item label="longitude">
                        {dataInit?.longitude}
                    </Descriptions.Item>
                    
                    {/* <Descriptions.Item label="Trạng thái">
                        <Tag color={dataInit.isActive ? "lime" : "red"} >
                             {dataInit.isActive ? "Đã điểm danh" : "Chưa điểm danh"}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Cuộc họp">
                        {dataInit?.jobId?.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Đơn vị">
                        {dataInit?.companyId?.name}
                    </Descriptions.Item> */}
                    <Descriptions.Item label="Ngày tạo">{dataInit && dataInit.createdAt ? dayjs(dataInit.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}</Descriptions.Item>
                    <Descriptions.Item label="Ngày sửa">{dataInit && dataInit.updatedAt ? dayjs(dataInit.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}</Descriptions.Item>

                </Descriptions>
            </Drawer>
        </>
    )
}

export default ViewDetailAttendance;