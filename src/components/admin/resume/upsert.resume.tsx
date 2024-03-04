import { Breadcrumb, Button, Col, ConfigProvider, Divider, Form, Row, Upload, message, notification } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DebounceSelect } from "../user/debouce.select";
import { FooterToolbar, ProForm, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormSwitch, ProFormText } from "@ant-design/pro-components";
import styles from 'styles/admin.module.scss';
import { useState, useEffect } from 'react';
import { callCreateResume, callFetchCompany, callFetchJob, callFetchResumeById, callUpdateResume, callUploadSingleFile } from "@/config/api";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CheckSquareOutlined, UploadOutlined } from "@ant-design/icons";
import enUS from 'antd/lib/locale/en_US';
import dayjs from 'dayjs';
import { IResume } from "@/types/backend";
import type { UploadProps } from 'antd';

const ViewUpsertResume = (props: any) => {
    const [companies, setCompanies] = useState<any>([]);
    const [jobs, setJobs] = useState<any>([]);

    const navigate = useNavigate();
    const [value, setValue] = useState<string>("");
    const [urlCV, setUrlCV] = useState<string>("");

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // resume id
    const [dataUpdate, setDataUpdate] = useState<IResume | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const init = async () => {
            if (id) {
                const res = await callFetchResumeById(id);
                if (res && res.data) {
                    console.log(res.data)
                    setDataUpdate(res.data);
        
                    form.setFieldsValue({
                        ...res.data,
                        companyId: res.data.companyId as string,
                        jobId:res.data.jobId as string,

                    })
                }
            }
        }
        init();
        return () => form.resetFields()
    }, [id])

    // Usage of DebounceSelect
    async function fetchCompanyList(name: string): Promise<any> {
        const res = await callFetchCompany(`current=1&pageSize=100&name=/${name}/i`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: item._id as string
                }
            })
            return temp;
        } else return [];
    }

     // Usage of DebounceSelect
    async function fetchJobList(name: string): Promise<any> {
        const res = await callFetchJob(`current=1&pageSize=100&name=/${name}/i`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: item._id as string
                }
            })
            return temp;
        } else return [];
    }

    const propsUpload: UploadProps = {
        maxCount: 1,
        multiple: false,
        accept: "application/pdf,application/msword, .doc, .docx, .pdf",
        async customRequest({ file, onSuccess, onError }: any) {
            const res = await callUploadSingleFile(file, "resume");
            if (res && res.data) {
                //console.log(res);
                //console.log(res.data.toString());
                setUrlCV(res.data.toString());
                if (onSuccess) onSuccess('ok')
            } else {
                if (onError) {
                    setUrlCV("");
                    const error = new Error(res.message);
                    onError({ event: error });
                }
            }
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file.")
            }
        },
    };


    const onFinish = async (values: any) => {
          //console.log(values);
        if (dataUpdate?._id) {
            //update
            const resume = {
                question: values.question,
                status: values.status,
                companyId: values.companyId.key,
                jobId: values.jobId.key,
            }
             //console.log(resume);

            const res = await callUpdateResume(values.status, dataUpdate._id);
            if (res.data) {
                message.success("Cập nhật resume thành công");
                navigate('/admin/resume')
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
           
            //create
            const resume = {
                url: values.url,
                status: values.status,
                companyId: values.companyId.key,
                jobId: values.jobId.key,
            }
            //console.log(resume);
            //console.log(urlCV);

            const res = await callCreateResume(urlCV,values.companyId.key,values.jobId.key);
            if (res.data) {
                message.success("Tạo mới resume thành công");
                navigate('/admin/resume')
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    


    return (
        <div className={styles["upsert-job-container"]}>
            <div className={styles["title"]}>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: <Link to="/admin/resume">Manage Tài liệu</Link>,
                        },
                        {
                            title: 'Upsert Tài liệu',
                        },
                    ]}
                />
            </div>
            <div >

                <ConfigProvider locale={enUS}>
                    <ProForm
                        form={form}
                        onFinish={onFinish}
                        submitter={
                            {
                                searchConfig: {
                                    resetText: "Hủy",
                                    submitText: <>{dataUpdate?._id ? "Cập nhật Tài liệu" : "Tạo mới Tài liệu"}</>
                                },
                                onReset: () => navigate('/admin/resume'),
                                render: (_: any, dom: any) => <FooterToolbar>{dom}</FooterToolbar>,
                                submitButtonProps: {
                                    icon: <CheckSquareOutlined />
                                },
                            }
                        }
                    >
                        <Row gutter={[20, 20]}>
                            <Col span={24} md={6}>
                                <ProForm.Item
                                    label={"Upload file"}
                                    rules={[{ required: true, message: 'Vui lòng upload file!' }]}
                                >

                                    <Upload {...propsUpload}>
                                        <Button icon={<UploadOutlined />}>Tải lên file của bạn (*.doc, *.docx, *.pdf, &lt; 5MB )</Button>
                                    </Upload>
                                </ProForm.Item>
                            </Col>

                             {(dataUpdate?._id || !id) &&
                                <Col span={24} md={6}>
                                    <ProForm.Item
                                        name="jobId"
                                        label="Cuộc họp"
                                        rules={[{ required: true, message: 'Vui lòng chọn cuộc họp!' }]}
                                    >
                                        <DebounceSelect
                                            allowClear
                                            showSearch
                                            defaultValue={jobs}
                                            value={jobs}
                                            placeholder="Chọn cuộc họp"
                                            fetchOptions={fetchJobList}
                                            onChange={(newValue: any) => {
                                                if (newValue?.length === 0 || newValue?.length === 1) {
                                                    setJobs(newValue);
                                                }
                                            }}
                                            style={{ width: '100%' }}
                                        />
                                    </ProForm.Item>

                                </Col>
                            }


                            {(dataUpdate?._id || !id) &&
                                <Col span={24} md={6}>
                                    <ProForm.Item
                                        name="companyId"
                                        label="Công Ty"
                                        rules={[{ required: true, message: 'Vui lòng chọn đơn vị!' }]}
                                    >
                                        <DebounceSelect
                                            allowClear
                                            showSearch
                                            defaultValue={companies}
                                            value={companies}
                                            placeholder="Chọn đơn vị"
                                            fetchOptions={fetchCompanyList}
                                            onChange={(newValue: any) => {
                                                if (newValue?.length === 0 || newValue?.length === 1) {
                                                    setCompanies(newValue);
                                                }
                                            }}
                                            style={{ width: '100%' }}
                                        />
                                    </ProForm.Item>

                                </Col>
                            }
                            {/* <Col span={24} md={6}>
                                <ProFormSwitch
                                    label="Trạng thái"
                                    name="status"
                                    checkedChildren="ACTIVE"
                                    unCheckedChildren="INACTIVE"
                                    initialValue={true}
                                    fieldProps={{
                                        defaultChecked: true,
                                    }}
                                />
                            </Col> */}
                        </Row>
                        
                        <Divider />
                    </ProForm>
                </ConfigProvider>

            </div>
        </div>
    )
}

export default ViewUpsertResume;