"use client"

import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

export default function EditTemplate() {
    const [showHtml, setShowHtml] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);

    const params = useParams();
    const id = params.id;

    const [name, setName] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");

    const [ccEmail, setCCEmail] = useState<string[]>([]);
    const [bccEmail, setBccEmail] = useState<string[]>([]);
    const [isActive, setActive] = useState<boolean>(true);
    const [orgId, setOrgId] = useState<string | null>(null);

    const subjectRef = useRef<HTMLInputElement>(null);
    const lastFocusedField = useRef<"subject" | "editor">("editor");

    const router = useRouter();

    const dynamicFields = [
        { heading: "Customer Details", fields: ["{{CUSTOMER_NAME}}"] },
        { heading: "Case Details", fields: ["{{CASE_ID}}", "{{CASE_TYPE}}", "{{CASE_STATUS}}", "{{CASE_CREATED_DATE}}", "{{PROPERTY_ADDRESS}}"] },
        { heading: "Parties Details", fields: ["{{SELLER_NAME}}", "{{BUYER_EMAIL}}", "{{SELLER_EMAIL}}"] },
        { heading: "Organization Details", fields: ["{{ORG_NAME}}"] },
    ];

    // Fetch template data
    useEffect(() => {
        const getTemplate = async () => {
            const response = await api(`/admin/email-templates/${id}`, { method: "GET" });

            if (response.ok) {
                const template = response.results?.data;
                setName(template.name);
                setSubject(template.subject);
                setBody(template.body);
                // Set initial editor content once
                if (editorRef.current) editorRef.current.innerHTML = template.body;
            } else {
                toast.error("Error: " + response.results?.message);
            }
        };
        getTemplate();
    }, [id]);

    // Exec formatting commands
    const execCmd = (cmd: string, value: string = "") => {
        document.execCommand(cmd, false, value);
        setBody(editorRef.current?.innerHTML || "");
    };

    // Insert field in subject
    const insertFieldToSubject = (field: string) => {
        const input = subjectRef.current;
        if (!input) return;

        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;

        const newValue = subject.substring(0, start) + field + subject.substring(end);
        setSubject(newValue);

        setTimeout(() => {
            input.focus();
            input.setSelectionRange(start + field.length, start + field.length);
        }, 0);
    };

    // Insert field in editor at cursor
    const insertField = (field: string) => {
        const editor = editorRef.current;
        if (!editor) return;

        editor.focus();

        const sel = window.getSelection();
        if (!sel || !sel.rangeCount) return;

        const range = sel.getRangeAt(0);
        range.deleteContents();

        // Use a span for stable cursor
        const span = document.createElement("span");
        span.textContent = field;

        range.insertNode(span);

        // Move cursor after the inserted span
        range.setStartAfter(span);
        range.collapse(true);

        sel.removeAllRanges();
        sel.addRange(range);

        setBody(editor.innerHTML);
    };

    // Update body on input
    const handleEditorInput = () => {
        const editor = editorRef.current;
        if (!editor) return;
        setBody(editor.innerHTML);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name,
            subject,
            body,
            ccEmails: ccEmail,
            bccEmails: bccEmail,
            isActive,
            orgId,
        };

        console.log(payload);

        try {
            const res = await api(`/admin/email-templates/${id}`, {
                method: "PATCH",
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                toast.error("Error: " + res.results?.message);
                return;
            }

            toast.success("Success! Template Saved Successfully.");
            router.push("/templates");
        } catch (error) {
            console.error(error);
            toast.error("Error saving template");
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button type="button" className="text-slate-400 hover:text-slate-600 transition-colors">
                            <span className="material-icons-outlined">arrow_back</span>
                        </button>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Email Template</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            <button type="button" className="px-3 py-1 text-xs font-semibold rounded bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white flex items-center gap-1">
                                <span className="material-icons-outlined text-sm">edit</span> Build
                            </button>
                            <button type="button" className="px-3 py-1 text-xs font-semibold rounded text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700 flex items-center gap-1">
                                <span className="material-icons-outlined text-sm">visibility</span> Preview
                            </button>
                        </div>
                    </div>
                </header>

                {/* Form */}
                <div className="flex-1 overflow-auto bg-slate-50 dark:bg-background-dark p-8">
                    <form className="max-w-6xl mx-auto flex gap-8" onSubmit={handleSave}>
                        <div className="flex-1 space-y-6">
                            {/* Template Name & Subject */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2 space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Template Name</label>
                                        <select
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary dark:text-white text-sm px-3 py-2"
                                        >
                                            <option value="" disabled>
                                                Select document type
                                            </option>
                                            <option value="NOC">NOC</option>
                                            <option value="BANK_CLEARENCE_LETTER">Bank Clearance Letter</option>
                                            <option value="INCOME_PROOF">Income Proof</option>
                                            <option value="BANK_STATEMENT">Bank Statement</option>
                                            <option value="IDENTIFICATION">Identification</option>
                                            <option value="VALUATION">Valuation</option>
                                            <option value="FOL">FOL</option>
                                            <option value="DEED">Deed</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2 space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Subject</label>
                                        <input
                                            ref={subjectRef}
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            onFocus={() => lastFocusedField.current = "subject"}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary dark:text-white text-sm"
                                            placeholder="Your property matter with {{LawFirmName}}"
                                            type="text"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Editor */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-700">
                                {/* Toolbar */}
                                <div className="flex items-center gap-2 p-2 border-b border-slate-200 dark:border-slate-700">
                                    <button type="button" onClick={() => execCmd("bold")} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                                        <span className="material-icons-outlined">format_bold</span>
                                    </button>
                                    <button type="button" onClick={() => execCmd("italic")} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                                        <span className="material-icons-outlined">format_italic</span>
                                    </button>
                                    <button type="button" onClick={() => execCmd("underline")} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                                        <span className="material-icons-outlined">format_underlined</span>
                                    </button>
                                    <button type="button" onClick={() => execCmd("insertUnorderedList")} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                                        <span className="material-icons-outlined">format_list_bulleted</span>
                                    </button>
                                    <button type="button" onClick={() => execCmd("insertOrderedList")} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                                        <span className="material-icons-outlined">format_list_numbered</span>
                                    </button>
                                    <button type="button" onClick={() => {
                                        const url = prompt("Enter link URL");
                                        if (url) execCmd("createLink", url);
                                    }} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                                        <span className="material-icons-outlined">link</span>
                                    </button>
                                    <button type="button" onClick={() => {
                                        const url = prompt("Enter image URL");
                                        if (url) execCmd("insertImage", url);
                                    }} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                                        <span className="material-icons-outlined">insert_photo</span>
                                    </button>
                                    <div className="flex-1"></div>
                                    <button type="button" onClick={() => setShowHtml(!showHtml)} className="px-2 py-1 text-sm text-blue-500">HTML View</button>
                                </div>

                                {/* Editor div */}
                                <div
                                    ref={editorRef}
                                    contentEditable
                                    suppressContentEditableWarning
                                    className="p-4 min-h-[300px] outline-none prose dark:prose-invert max-w-none"
                                    onInput={handleEditorInput}
                                    onFocus={() => lastFocusedField.current = "editor"}
                                />
                            </div>

                            {/* Save / Cancel */}
                            <div className="flex items-center justify-end gap-3 pt-4">
                                <button onClick={() => router.push('/templates')} type="button" className="px-6 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" className="px-8 py-2.5 text-sm font-semibold bg-primary hover:bg-blue-900 text-white rounded-lg shadow-sm transition-all transform active:scale-95">Save Template</button>
                            </div>
                        </div>

                        {/* Sidebar with dynamic fields */}
                        <div className="w-72 flex flex-col gap-6">
                            {/* Dynamic fields panel */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                        Dynamic Fields
                                        <span className="material-icons-outlined text-sm cursor-help" title="Click to insert field at cursor">info</span>
                                    </h3>
                                </div>
                                <div className="p-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
                                    {dynamicFields.map(group => (
                                        <div key={group.heading}>
                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">{group.heading}</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {group.fields.map(field => (
                                                    <button
                                                        key={field}
                                                        type="button"
                                                        onClick={() => lastFocusedField.current === "subject" ? insertFieldToSubject(field) : insertField(field)}
                                                        className="px-2 py-1 text-[11px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded border border-blue-100 dark:border-blue-800 hover:border-blue-400 transition-colors"
                                                    >
                                                        {field}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main>

            {/* HTML Preview */}
            {showHtml && (
                <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-8">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-full rounded-2xl flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="font-bold">Template Preview</h3>
                            <button type="button" onClick={() => setShowHtml(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="material-icons-outlined">close</span>
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-950 p-12">
                            <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 shadow-xl p-10 rounded" dangerouslySetInnerHTML={{ __html: body }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}