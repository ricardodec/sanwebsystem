import { useRef, useState, useEffect, SyntheticEvent } from 'react';
import { Toast } from 'primereact/toast';
import Image from 'next/image';
import {
    FileUpload, FileUploadFile, FileUploadHeaderTemplateOptions, FileUploadSelectEvent,
    FileUploadUploadEvent, ItemTemplateOptions, FileUploadErrorEvent, FileUploadOptions
} from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';

const IMAGENS = "image/*";
const URL_UPLOAD = '/api/upload';

type UploadFileType = Blob | ArrayBuffer | string;

const createFileUpload = (file: UploadFileType, mimeType: string): FileUploadFile => {
    
    const fileUpload = new File(
        [file],
        "filename.png",
        { type: mimeType, lastModified: Date.now() },
    ) as FileUploadFile;

    if (typeof(file) === "string")
        fileUpload.objectURL = file;
    
    return fileUpload;
};

const iconFileType = (mimeType: string) => {
    if (mimeType === "application/pdf")
        return "pi pi-file-pdf";
    else if (mimeType.startsWith(`video/`))
        return "pi pi-video";
    else if (mimeType.startsWith(`audio/`))
        return "pi pi-microphone";
    else if (mimeType.includes("excel") || mimeType.includes("spreadsheetml"))
        return "pi pi-file-excel";
    else if (mimeType.includes("word") || mimeType.includes("wordprocessingml"))
        return "pi pi-file-word";
    else
        return "pi pi-file";
};

interface FileAvatarUIProps {
    file: UploadFileType;
    mimeType: string;
    size?: "large" | "normal" | "xlarge";
};

export const FileAvatarUI = ({file, mimeType, size = "large"}: Readonly<FileAvatarUIProps>) => {
    if (mimeType.startsWith(`image/`))
        return <Avatar image={file as string} size={size} shape="circle" />;

    return <Avatar icon={iconFileType(mimeType)} size={size} shape="circle" />;
};

interface FileUploadUIProps {
    id: string;
    file?: UploadFileType,
    mimeType?: string,
    maxFileSize?: number;
    multiple?: boolean;
    accept?: "image/*" | "text/*" | "audio/*" | "video/*" | "application/pdf" | "application/xml" |
                "application/mspowerpoint" | "application/vnd.ms-powerpoint" | "application/vnd.openxmlformats-officedocument.presentationml.presentation" |
                "application/msexcel" | "application/vnd.ms-excel" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" |
                "application/msword" | "application/vnd.ms-word" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    disabled?: boolean,
    onUpload?: (fileName: string, type: string, result: string | null) => void;
    onRemove?: (fileName: string) => void;
    onClear?: () => void;
};

export const FileUploadUI = ({id, file, mimeType, maxFileSize = 65534, multiple, accept = IMAGENS, disabled = false, onUpload, onRemove, onClear}: Readonly<FileUploadUIProps>) => {

    const toast = useRef<Toast>(null);
    const [totalSize, setTotalSize] = useState(0);
    const componentRef = useRef<FileUpload>(null);
    const maxFileSizeKb = Math.round(maxFileSize / 1024);

    useEffect(() => {
        if (file && mimeType && componentRef.current?.getUploadedFiles().length === 0) {
            const fileUpload = createFileUpload(file, mimeType);
            
            componentRef.current?.setFiles([
                fileUpload
            ]);

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTotalSize(fileUpload.size);
        }
    }, [file, mimeType]);

    const onTemplateSelect = (e: FileUploadSelectEvent) => {
        let totalSelected = totalSize;

        for (const file of e.files) {
            totalSelected += file.size || 0;
        }

        if (totalSelected <= maxFileSize)
            setTotalSize(totalSelected);
    }

    const onTemplateUpload = (e: FileUploadUploadEvent) => {
        for (const file of e.files) {
            fetch(file.objectURL)
                .then((r) => r.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);

                    reader.onloadend = () => {
                        onUpload?.(file.name, file.type, reader.result as string);
                    }
                });
        }

        componentRef.current?.setFiles([]);

        toast.current?.show({ severity: 'info', summary: 'Success', detail: 'Upload realizado com sucesso!' });
    };

    const onRemoveClick = (event: SyntheticEvent<Element, Event>, file: FileUploadFile, callback?: (event: SyntheticEvent<Element, Event>) => void) => {
        setTotalSize(totalSize - file.size || 0);

        callback?.(event);
        onRemove?.(file.name);
    };

    const onTemplateClear = () => {
        setTotalSize(0);
        onClear?.();
    };

    const onTemplateError = (e: FileUploadErrorEvent) => {
        toast.current?.show({ severity: 'error', summary: 'Erro', detail: e.xhr.responseText, sticky: true});
    };

    const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = Math.round(totalSize / 1024);
        const formatedValue = componentRef.current?.formatSize(totalSize) ?? '0 KB';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {onUpload !== undefined && chooseButton}
                {onUpload !== undefined && uploadButton}
                {onClear !== undefined && cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / {maxFileSizeKb} KB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
        const fileUpload = inFile as FileUploadFile;
        
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    {
                        fileUpload.type.startsWith(`image/`) ?
                            <Image alt={fileUpload.name} role="presentation" src={fileUpload.objectURL} width={100} />
                            :
                            <i className={iconFileType(fileUpload.type) + " p-2"} style={{ fontSize: '2em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                    }
                    <span className="flex flex-column text-left ml-3">
                        {fileUpload.name}
                        <small>{new Date().toLocaleDateString('pt-BR')}</small>
                    </span>
                </div>
                
                <Tag value={props.formatSize} severity="warning" className="ml-4 px-3 py-2" />
                
                {onRemove &&
                    <Button type="button" outlined rounded severity='danger' aria-label="Excluir" className="ml-auto" onClick={(event) => onRemoveClick(event, fileUpload, props.onRemove)}>
                        <i className="pi pi-times"></i>
                    </Button>
                }
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex flex-column align-items-center">
                <i className={(accept.toLowerCase() === IMAGENS ? "pi pi-image" : "pi pi-file") + " mt-1 p-3"} style={{ fontSize: '3em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="mt-3">
                    Arraste e Solte {accept.toLowerCase() === IMAGENS ? `a imagem` : `o arquivo`} Aqui!
                </span>
            </div>
        );
    };

    const chooseOptions: FileUploadOptions = { icon: 'pi pi-fw pi-file-plus', iconOnly: false, label:"Selecionar", className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions: FileUploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: false, label:"Upload", className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions: FileUploadOptions = { icon: 'pi pi-fw pi-trash', iconOnly: false, label:"Limpar", className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    return (
        <>
            <Toast ref={toast}></Toast>

            <Tooltip target=".custom-choose-btn" content="Selecione" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Limpa" position="bottom" />

            <FileUpload
                ref={componentRef}
                id={id}
                name={`${id}[]`}
                url={URL_UPLOAD} 
                accept={accept}
                maxFileSize={maxFileSize}
                multiple={multiple}
                disabled={disabled}
                onUpload={onTemplateUpload}
                onSelect={onTemplateSelect}
                onClear={onTemplateClear}
                onError={onTemplateError}
                headerTemplate={headerTemplate}
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions}
                uploadOptions={uploadOptions}
                cancelOptions={cancelOptions}
                invalidFileSizeMessageDetail={"Aceitos " + (accept.toLowerCase() === IMAGENS ? "imagens" : "arquivos") + " com no máximo " + maxFileSizeKb + " KB"}
            />
        </>
    )
}